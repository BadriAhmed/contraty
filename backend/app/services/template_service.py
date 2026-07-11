"""Template service — business logic between API and repository.

Handles:
- Template CRUD via repository
- Contract generation via LLM router
- PDF rendering
- Embedding search (via vector store)
"""

import time
import json
import logging
from typing import Optional

from app.core.config import get_settings
from app.db.repository import TemplateRepository, ContractRepository
from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository
from app.db.supabase_repo import SupabaseTemplateRepository, SupabaseContractRepository
from app.models.contract import Language, Contract, ContractResponse
from app.models.generation import GenerateRequest, ContractWarning
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
        if settings.supabase_url and settings.supabase_service_key:
            _template_repo = SupabaseTemplateRepository()
            logger.info("Using Supabase template repository")
        else:
            _template_repo = InMemoryTemplateRepository()
            logger.info("Using in-memory template repository (SUPABASE_SERVICE_KEY not set)")
    return _template_repo


def get_contract_repo() -> ContractRepository:
    global _contract_repo
    if _contract_repo is None:
        if settings.supabase_url and settings.supabase_service_key:
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
    t0 = time.monotonic()

    # Simple template engine — direct placeholder substitution, no LLM needed
    filled = _fill_template(contract, req.user_fields, req.language)
    elapsed_ms = int((time.monotonic() - t0) * 1000)

    return {
        "success": True,
        "contract": filled,
        "model_used": "template-engine",
        "language": req.language.value if isinstance(req.language, Language) else req.language,
        "error": None,
        "fallback_attempted": False,
        "generation_time_ms": elapsed_ms,
        "tokens_used": 0,
    }


def _fill_template(template: Contract, user_fields: dict[str, str], language: Language) -> dict:
    """Replace [PLACEHOLDER] tokens with user values. No LLM, no latency."""
    import copy

    data = template.model_dump()
    for section in data["sections"]:
        for article in section["articles"]:
            text_key = "text_ar" if language == Language.ar else "text_fr"
            text = article[text_key]
            for key, val in user_fields.items():
                text = text.replace(f"[{key}]", str(val))
            article[text_key] = text
            article["fields"] = []  # clear field markers after substitution
    return data


async def generate_pdf(contract_json: dict, language: str, contract_slug: str) -> bytes:
    lang = Language(language)
    contract = Contract(**contract_json)
    return pdf_renderer.render_contract(contract, lang)


async def embed_texts(texts: list[str]) -> list[list[float]]:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required for embeddings")
    return await vector_store.embed(texts)


async def review_contract(
    filled_contract: dict,
    language: Language,
    user_fields: dict[str, str],
) -> list[ContractWarning]:
    """Review a filled contract with Gemini Flash for common user errors."""
    if not settings.gemini_api_key:
        return []

    from google.genai import Client

    lines = []
    for s in filled_contract.get("sections", []):
        key = "title_ar" if language == Language.ar else "title_fr"
        tkey = "text_ar" if language == Language.ar else "text_fr"
        lines.append(f"[{s.get(key, '')}]")
        for a in s.get("articles", []):
            text = a.get(tkey, "")
            if text.strip():
                lines.append(text)
    contract_text = "\n".join(lines)[:3000]

    title = filled_contract.get("title_fr" if language == Language.fr else "title_ar", "")
    fields_str = ", ".join(f"{k}={v}" for k, v in list(user_fields.items())[:20])

    prompt = f"""Avocat tunisien. Ce contrat vient d'être rempli. Signale UNIQUEMENT les vrais problèmes:
1. Champs obligatoires vides [CHAMP] dans le texte final
2. Valeurs incohérentes (ex: loyer 5 TND à Tunis)
3. Dates passées
4. Noms incomplets ou identiques entre parties
5. Incohérences entre type de contrat et valeurs

Ne commente pas les clauses standards, ni les références légales.
Si tout va bien, réponds exactement: RIEN_A_SIGNALER

Format de réponse pour chaque problème (JSON array uniquement, pas de markdown):
[{{"field":"NOM","severity":"error","message_fr":"...","message_ar":"...","suggestion_fr":"...","suggestion_ar":"..."}}]

Contrat: {title}
Champs fournis: {fields_str}
Texte: {contract_text}"""

    try:
        client = Client(api_key=settings.gemini_api_key)
        response = await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )
        text = response.text.strip()

        if "RIEN_A_SIGNALER" in text:
            return []

        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            raw = json.loads(text[start:end + 1])
            if isinstance(raw, list):
                return [ContractWarning(**w) for w in raw if isinstance(w, dict)]

    except Exception as e:
        logger.warning("Contract review error: %s", str(e)[:200])

    return []


def _build_prompt(template: Contract, user_fields: dict[str, str], language: Language) -> str:
    slim = {
        "slug": template.slug,
        "disclaimer": template.disclaimer,
        "sections": [
            {
                "id": s.id,
                "title_ar": s.title_ar,
                "title_fr": s.title_fr,
                "articles": [
                    {"id": a.id, "text_ar": a.text_ar, "text_fr": a.text_fr, "fields": a.fields}
                    for a in s.articles
                ],
            }
            for s in template.sections
        ],
    }
    template_text = json.dumps(slim, indent=2, ensure_ascii=False)
    fields_text = "\n".join(f"  {k}: {v}" for k, v in user_fields.items()) if user_fields else "  (aucun champ fourni)"

    match language:
        case Language.fr:
            instruction = (
                "Tu es un assistant juridique tunisien. Remplis chaque [CHAMP] "
                "avec la valeur correspondante fournie ci-dessous. "
                "Ne modifie pas la structure, n'ajoute pas de clauses, "
                "et conserve l'avertissement légal tel quel. "
                "Retourne uniquement le JSON du contrat complété."
            )
        case Language.ar:
            instruction = (
                "أنت مساعد قانوني تونسي. استبدل كل [حقل] بالقيمة المناسبة أدناه. "
                "لا تغير الهيكل، لا تضف بنودًا، واحتفظ بالإخلاء القانوني كما هو. "
                "أعد فقط JSON العقد المكتمل."
            )

    return f"""{instruction}

CHAMPS UTILISATEUR :
{fields_text}

MODÈLE DE CONTRAT (JSON) :
{template_text}

CONTRAT COMPLÉTÉ (JSON uniquement, pas de commentaires) :
"""
