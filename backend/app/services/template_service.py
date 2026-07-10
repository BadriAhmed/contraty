"""Template service — business logic between API and repository.

Handles:
- Template CRUD via repository
- Contract generation via LLM router
- PDF rendering
- Embedding search (via vector store)
"""

import time
import logging
from typing import Optional

from app.core.config import get_settings
from app.db.repository import TemplateRepository, ContractRepository
from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository
from app.db.supabase_repo import SupabaseTemplateRepository, SupabaseContractRepository
from app.models.contract import Language, Contract, ContractResponse
from app.models.generation import GenerateRequest
from app.services.llm import router as llm_router
from app.services.pdf import pdf_renderer
from app.db.vector import vector_store

logger = logging.getLogger(__name__)
settings = get_settings()

_template_repo: Optional[TemplateRepository] = None
_contract_repo: Optional[ContractRepository] = None


def get_template_repo() -> TemplateRepository:
    global _template_repo
    if _template_repo is None:
        if settings.supabase_url:
            _template_repo = SupabaseTemplateRepository()
            logger.info("Using Supabase template repository")
        else:
            _template_repo = InMemoryTemplateRepository()
            logger.info("Using in-memory template repository")
    return _template_repo


def get_contract_repo() -> ContractRepository:
    global _contract_repo
    if _contract_repo is None:
        if settings.supabase_url:
            _contract_repo = SupabaseContractRepository()
        else:
            _contract_repo = InMemoryContractRepository()
    return _contract_repo


def set_template_repo(repo: TemplateRepository):
    """Override template repository (for testing)."""
    global _template_repo
    _template_repo = repo


def set_contract_repo(repo: ContractRepository):
    """Override contract repository (for testing)."""
    global _contract_repo
    _contract_repo = repo


async def ensure_seeded():
    repo = get_template_repo()
    if isinstance(repo, InMemoryTemplateRepository) and len(repo._templates) == 0:
        from app.db.seed import seed_templates
        await seed_templates(repo)


async def list_templates(domain: Optional[str] = None, language: Optional[str] = None) -> list[dict]:
    await ensure_seeded()
    return await get_template_repo().list_all(domain=domain, language=language)


async def get_template(slug: str) -> Optional[dict]:
    await ensure_seeded()
    return await get_template_repo().get_by_slug(slug)


async def generate_contract(req: GenerateRequest) -> dict:
    await ensure_seeded()
    repo = get_template_repo()
    template = await repo.get_by_slug(req.contract_slug)
    if template is None:
        return {
            "success": False,
            "contract": None,
            "model_used": "",
            "language": req.language,
            "error": f"Template '{req.contract_slug}' not found",
            "fallback_attempted": False,
            "generation_time_ms": 0,
            "tokens_used": 0,
        }

    contract = Contract(**template)
    prompt = _build_prompt(contract, req.user_fields, req.language)
    t0 = time.monotonic()

    result: ContractResponse = await llm_router.generate(prompt, req.language)
    elapsed_ms = int((time.monotonic() - t0) * 1000)

    return {
        "success": result.success,
        "contract": result.contract.model_dump() if result.contract else None,
        "model_used": result.model_used,
        "language": result.language.value if isinstance(result.language, Language) else result.language,
        "error": result.error,
        "fallback_attempted": result.fallback_attempted,
        "generation_time_ms": elapsed_ms,
        "tokens_used": 0,
    }


async def generate_pdf(contract_json: dict, language: str, contract_slug: str) -> bytes:
    lang = Language(language)
    contract = Contract(**contract_json)
    return pdf_renderer.render_contract(contract, lang)


async def embed_texts(texts: list[str]) -> list[list[float]]:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required for embeddings")
    return await vector_store.embed(texts)


def _build_prompt(template: Contract, user_fields: dict[str, str], language: Language) -> str:
    template_text = template.model_dump_json(indent=2)
    fields_text = "\n".join(f"  {k}: {v}" for k, v in user_fields.items())

    match language:
        case Language.fr:
            instruction = (
                "Tu es un assistant juridique tunisien. Remplis les champs [CHAMP_*] "
                "du modèle de contrat ci-dessous avec les valeurs fournies. "
                "Ne modifie pas la structure, n'ajoute pas de clauses, et conserve "
                "l'avertissement légal tel quel. "
                "Retourne le contrat au format JSON identique au modèle."
            )
        case Language.ar:
            instruction = (
                "أنت مساعد قانوني تونسي. املأ الحقول [CHAMP_*] في نموذج العقد أدناه "
                "بالقيم المقدمة. لا تغير الهيكل، لا تضف بنودًا، واحتفظ بالإخلاء القانوني "
                "كما هو. أعد العقد بصيغة JSON مطابقة للنموذج."
            )

    return f"""{instruction}

CHAMPS UTILISATEUR :
{fields_text}

MODÈLE DE CONTRAT (JSON) :
{template_text}

CONTRAT COMPLÉTÉ (JSON uniquement, pas de commentaires) :
"""
