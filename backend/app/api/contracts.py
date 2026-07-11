import logging
from fastapi import APIRouter, HTTPException
from app.models.generation import GenerateRequest, GenerateResponse, PDFRequest, TemplateSummary, TemplateDetail
from app.models.contract import Language, Contract, TemplateSection, FieldMetadata
from app.services.template_service import (
    list_templates,
    get_template,
    generate_contract,
    generate_pdf,
)

router = APIRouter()
logger = logging.getLogger(__name__)


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
        domain=t.get("domain", ""),
        complexity=t.get("complexity", "medium"),
        field_count=t.get("field_count", 0),
        legal_basis=t.get("legal_basis", ""),
        disclaimer=t.get("disclaimer", ""),
        sections=sections,
        field_metadata=field_metadata,
    )


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
async def generate_contract_endpoint(req: GenerateRequest):
    if not req.contract_slug:
        raise HTTPException(status_code=400, detail="contract_slug is required")
    if not req.user_fields:
        raise HTTPException(status_code=400, detail="user_fields must not be empty")

    result = await generate_contract(req)
    if not result["success"]:
        return GenerateResponse(**result)

    return GenerateResponse(**result)


@router.post("/generate/pdf")
async def generate_pdf_endpoint(req: PDFRequest):
    from fastapi.responses import Response

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
