import time
import logging
from fastapi import APIRouter, HTTPException
from app.models.generation import GenerateRequest, GenerateResponse, PDFRequest, TemplateSummary
from app.models.contract import Language
from app.services.llm import router as llm_router
from app.services.rag import rag_service
from app.services.pdf import pdf_renderer

router = APIRouter()
logger = logging.getLogger(__name__)


def _template_to_summary(t) -> TemplateSummary:
    field_count = sum(len(a.fields) for s in t.sections for a in s.articles)
    return TemplateSummary(
        slug=t.slug,
        title_ar=t.title_ar,
        title_fr=t.title_fr,
        domain=t.domain.value if t.domain else "",
        field_count=field_count,
    )


@router.get("/templates", response_model=list[TemplateSummary])
async def list_templates(domain: str | None = None, language: str | None = None):
    lang = Language(language) if language else None
    templates = rag_service.list_templates(domain=domain, language=lang)
    return [_template_to_summary(t) for t in templates]


@router.get("/templates/{contract_slug}", response_model=TemplateSummary)
async def get_template(contract_slug: str):
    for t in rag_service.list_templates():
        if t.slug == contract_slug:
            return _template_to_summary(t)
    raise HTTPException(status_code=404, detail="Template not found")


@router.post("/generate", response_model=GenerateResponse)
async def generate_contract(req: GenerateRequest):
    t0 = time.monotonic()

    template = await rag_service.search(req.contract_slug, req.language)
    if template is None:
        raise HTTPException(status_code=404, detail=f"Template '{req.contract_slug}' not found")

    prompt = _build_prompt(template, req.user_fields, req.language)
    result = await llm_router.generate(prompt, req.language)

    elapsed_ms = int((time.monotonic() - t0) * 1000)
    return GenerateResponse(
        **result.model_dump(),
        generation_time_ms=elapsed_ms,
        tokens_used=0,
    )


@router.post("/generate/pdf", response_class=bytes)
async def generate_pdf(req: PDFRequest):
    from app.models.contract import Contract

    try:
        contract = Contract(**req.contract_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid contract JSON: {e}")

    pdf_bytes = pdf_renderer.render_contract(contract, req.language)
    return pdf_bytes


def _build_prompt(template, user_fields: dict[str, str], language: Language) -> str:
    template_text = template.model_dump_json(indent=2)
    fields_text = "\n".join(f"  {k}: {v}" for k, v in user_fields.items())

    match language:
        case Language.fr:
            instruction = "Tu es un assistant juridique tunisien. Remplis les champs [CHAMP_*] du modèle de contrat ci-dessous avec les valeurs fournies. Ne modifie pas la structure, n'ajoute pas de clauses, et conserve l'avertissement légal tel quel. Retourne le contrat au format JSON identique au modèle."
        case Language.ar:
            instruction = "أنت مساعد قانوني تونسي. املأ الحقول [CHAMP_*] في نموذج العقد أدناه بالقيم المقدمة. لا تغير الهيكل، لا تضف بنودًا، واحتفظ بالإخلاء القانوني كما هو. أعد العقد بصيغة JSON مطابقة للنموذج."

    return f"""{instruction}

CHAMPS UTILISATEUR :
{fields_text}

MODÈLE DE CONTRAT (JSON) :
{template_text}

CONTRAT COMPLÉTÉ (JSON uniquement, pas de commentaires) :
"""
