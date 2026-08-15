import time
import json
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import Response
from app.core.config import get_settings
from app.core.limiter import limiter
from app.api.auth import get_optional_user, UserInfo, AnonymousUser
from app.models.generation import GenerateRequest, GenerateResponse, PDFRequest, TemplateSummary, TemplateDetail
from app.models.contract import Language, Contract, TemplateSection, FieldMetadata
from app.services.template_service import (
    list_templates,
    get_template,
    generate_contract,
    generate_pdf,
    review_contract,
    _fill_blank_template,
    customize_blank_template,
    _generation_counts,
)
from app.services.docx import docx_renderer as _docx

router = APIRouter()
logger = logging.getLogger(__name__)
settings = get_settings()

def _find_data_dir(start: Path | None = None) -> Path:
    """Locate the repo ``data/`` dir in both source-tree and Docker layouts.

    This module lives at ``backend/app/api/`` in the source tree but at
    ``/app/app/api/`` inside the Cloud Run image, while ``data/`` sits at the
    repo root / image ``/app``. Walk up from this module until a directory
    containing ``data/`` is found so the same code works in both layouts.
    """
    current = start or Path(__file__).resolve().parent
    for _ in range(6):
        if (current / "data").is_dir():
            return current / "data"
        if current.parent == current:
            break
        current = current.parent
    return Path(__file__).resolve().parents[3] / "data"


_DATA_DIR = _find_data_dir()
_VEHICLES_PATH = _DATA_DIR / "vehicles" / "tn_cars.json"
_vehicles_cache: list[dict] | None = None

_REFERENCE_DIR = _DATA_DIR / "reference"
_reference_cache: dict[str, dict] = {}


def _load_reference(kind: str) -> dict:
    """Load a bilingual reference list (fr/ar) once, e.g. governorates, cities, tribunals."""
    if kind not in _reference_cache:
        try:
            _reference_cache[kind] = json.loads((_REFERENCE_DIR / f"{kind}.json").read_text(encoding="utf-8"))
        except FileNotFoundError:
            _reference_cache[kind] = {"fr": [], "ar": []}
    return _reference_cache[kind]


def _load_vehicles() -> list[dict]:
    """Load the Tunisia vehicle catalog once (brand + model names only)."""
    global _vehicles_cache
    if _vehicles_cache is None:
        try:
            raw = json.loads(_VEHICLES_PATH.read_text(encoding="utf-8"))
            _vehicles_cache = [
                {"brand": b.get("brand", ""), "models": [m.get("model", "") for m in b.get("models", [])]}
                for b in raw
                if b.get("brand")
            ]
        except FileNotFoundError:
            logger.warning("Vehicle catalog not found at %s", _VEHICLES_PATH)
            _vehicles_cache = []
    return _vehicles_cache


def _to_summary(t: dict) -> TemplateSummary:
    return TemplateSummary(
        slug=t.get("slug", ""),
        title_ar=t.get("title_ar", ""),
        title_fr=t.get("title_fr", ""),
        domain=t.get("domain", ""),
        complexity=t.get("complexity", "medium"),
        field_count=t.get("field_count", 0),
    )


def _to_detail(t: dict) -> TemplateDetail:
    sections_raw = t.get("sections", [])
    sections = [TemplateSection(**s) for s in sections_raw]

    meta_raw = t.get("field_metadata", {})
    field_metadata = {k: FieldMetadata(**v) if isinstance(v, dict) else v for k, v in meta_raw.items()}

    return TemplateDetail(
        slug=t.get("slug", ""),
        title_ar=t.get("title_ar", ""),
        title_fr=t.get("title_fr", ""),
        description_ar=t.get("description_ar", ""),
        description_fr=t.get("description_fr", ""),
        domain=t.get("domain", ""),
        complexity=t.get("complexity", "medium"),
        field_count=t.get("field_count", 0),
        legal_basis=t.get("legal_basis", ""),
        disclaimer=t.get("disclaimer", ""),
        sections=sections,
        field_metadata=field_metadata,
        generation_count=_generation_counts.get(t.get("slug", ""), 0),
    )


@router.get("/vehicles")
async def list_vehicles_endpoint():
    """Tunisia market vehicle catalog (brands + model names) for autocomplete."""
    return _load_vehicles()


_REFERENCE_KINDS = {
    "governorates",
    "cities",
    "places",
    "tribunals",
    "nationalities",
    "professions",
    "carburants",
}

# Templates seeded with an earlier convention still reference these aliases.
_REFERENCE_ALIASES = {
    "tn-place": "places",
    "tn-tribunal": "tribunals",
    "profession": "professions",
    "nationality": "nationalities",
}


@router.get("/reference/{kind}")
async def reference_endpoint(kind: str):
    """Bilingual reference lists (fr/ar) for autocomplete fields."""
    kind = _REFERENCE_ALIASES.get(kind, kind)
    if kind not in _REFERENCE_KINDS:
        raise HTTPException(status_code=404, detail=f"Unknown reference kind: {kind}")
    if kind == "places":
        gov = _load_reference("governorates")
        cities = _load_reference("cities")
        return {
            "fr": sorted(set(gov.get("fr", []) + cities.get("fr", [])), key=str.lower),
            "ar": list(dict.fromkeys(gov.get("ar", []) + cities.get("ar", []))),
        }
    return _load_reference(kind)


@router.get("/templates", response_model=list[TemplateSummary])
async def list_templates_endpoint(domain: str | None = None, language: str | None = None):
    templates = await list_templates(domain=domain, language=language)
    return [_to_summary(t) for t in templates]


@router.get("/templates/{contract_slug}", response_model=TemplateDetail)
async def get_template_endpoint(contract_slug: str):
    t = await get_template(contract_slug)
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return _to_detail(t)


@router.post("/generate", response_model=GenerateResponse)
@limiter.limit(f"{settings.rate_limit_requests}/minute")
async def generate_contract_endpoint(
    request: Request,
    req: GenerateRequest,
    user: UserInfo = Depends(get_optional_user),
):
    if not req.contract_slug:
        raise HTTPException(status_code=400, detail="contract_slug is required")
    if not req.user_fields:
        raise HTTPException(status_code=400, detail="user_fields must not be empty")

    result = await generate_contract(req)
    if not result["success"]:
        return GenerateResponse(**result)

    response = GenerateResponse(**result)

    if req.review and result.get("contract"):
        t0 = time.monotonic()
        warnings = await review_contract(result["contract"], req.language, req.user_fields, req.extra_notes)
        response.review_time_ms = int((time.monotonic() - t0) * 1000)
        response.warnings = warnings

    return response


@router.post("/generate/pdf")
async def generate_pdf_endpoint(req: PDFRequest):
    try:
        Contract(**req.contract_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid contract JSON: {e}")

    pdf_bytes = await generate_pdf(req.contract_json, req.language, req.contract_slug)
    filename = f"{req.contract_slug}-{req.language.value}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/generate/docx")
async def generate_docx_endpoint(req: PDFRequest):
    try:
        contract = Contract(**req.contract_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid contract JSON: {e}")

    docx_bytes = _docx.render_contract(contract, req.language)
    filename = f"{req.contract_slug}-{req.language.value}.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/templates/{contract_slug}/download")
async def download_blank_template_endpoint(
    contract_slug: str,
    language: Language = Language.fr,
    format: str = "pdf",
):
    t = await get_template(contract_slug)
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    contract = Contract(
        id=t.get("id", f"{contract_slug}-v1"),
        slug=contract_slug,
        title_ar=t.get("title_ar", ""),
        title_fr=t.get("title_fr", ""),
        sections=t.get("sections", []),
    )

    blank = _fill_blank_template(contract, language)

    if format == "docx":
        doc = Contract(**blank)
        docx_bytes = _docx.render_contract(doc, language)
        filename = f"{contract_slug}-vierge-{language.value}.docx"
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    else:
        pdf_bytes = await generate_pdf(blank, language.value, contract_slug)
        filename = f"{contract_slug}-vierge-{language.value}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )


@router.post("/templates/{contract_slug}/customize")
@limiter.limit(f"{settings.rate_limit_requests}/minute")
async def customize_blank_template_endpoint(
    request: Request,
    req: GenerateRequest,
    user: UserInfo = Depends(get_optional_user),
):
    """Customize a blank template with AI based on user prompt. One-time use only."""
    if not req.extra_notes:
        raise HTTPException(status_code=400, detail="extra_notes (prompt) is required")

    try:
        result = await customize_blank_template(req.contract_slug, req.language, req.extra_notes)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
