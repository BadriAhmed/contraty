"""Template service — business logic between API and repository.

Handles:
- Template CRUD via repository
- Contract generation via LLM router
- PDF rendering
- Embedding search (via vector store)
"""

import time
import json
import re
import logging
from typing import Optional

from app.core.config import get_settings
from app.db.repository import TemplateRepository, ContractRepository
from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository
from app.db.supabase_repo import SupabaseTemplateRepository, SupabaseContractRepository
from app.models.contract import Language, Contract, ContractResponse
from app.models.generation import GenerateRequest, ContractWarning
from app.services.llm import router as llm_router, get_gemini_client, _extract_json
from app.services.pdf import pdf_renderer
from app.db.vector import vector_store

logger = logging.getLogger(__name__)
settings = get_settings()

_template_repo: Optional[TemplateRepository] = None
_contract_repo: Optional[ContractRepository] = None
_customize_usage: set[str] = set()
_generation_counts: dict[str, int] = {}

# Simple TTL cache for template reads (templates change rarely)
_template_cache: dict[str, tuple] = {}  # key -> (data, timestamp)
_CACHE_TTL = 60  # seconds


def _cache_get(key: str):
    entry = _template_cache.get(key)
    if entry is None:
        return None
    data, ts = entry
    if time.monotonic() - ts > _CACHE_TTL:
        del _template_cache[key]
        return None
    return data


def _cache_set(key: str, data) -> None:
    _template_cache[key] = (data, time.monotonic())


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
    cache_key = f"list:{domain or 'all'}:{language or 'all'}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    await ensure_seeded()
    result = await get_template_repo().list_all(domain=domain, language=language)
    _cache_set(cache_key, result)
    return result


async def get_template(slug: str) -> Optional[dict]:
    cache_key = f"tpl:{slug}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached
    await ensure_seeded()
    result = await get_template_repo().get_by_slug(slug)
    if result is not None:
        _cache_set(cache_key, result)
    return result


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
    _generation_counts[req.contract_slug] = _generation_counts.get(req.contract_slug, 0) + 1
    t0 = time.monotonic()

    if req.use_ai:
        prompt = _build_prompt(contract, req.user_fields, req.language)
        result = await llm_router.generate(prompt, req.language)
        elapsed_ms = int((time.monotonic() - t0) * 1000)

        response = result.model_dump()
        response["generation_time_ms"] = elapsed_ms
        response["tokens_used"] = 0
        return response

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


_COND_RE = re.compile(r'\{\{#([A-Z0-9_]+)\}\}(.*?)\{\{/\1\}\}', re.DOTALL)
_ORPHAN_RE = re.compile(r'\[[A-Z][A-Z0-9_]*[A-Z0-9]\]')


def _fill_template(template: Contract, user_fields: dict[str, str], language: Language) -> dict:
    """Replace [PLACEHOLDER] tokens with user values. No LLM, no latency.

    Handles optional clauses via ``{{#FIELD}}...{{/FIELD}}`` blocks: when the
    field is empty/absent the whole block is removed, otherwise the inner text
    is kept (with the placeholder already substituted). Any unreplaced
    ``[PLACEHOLDER]`` token is stripped as a safety net so raw field keys never
    reach the final contract text.
    """
    data = template.model_dump()
    data["disclaimer"] = ""  # Remove disclaimer from output — user already accepted it
    metadata = data.get("field_metadata", {})
    for section in data["sections"]:
        for article in section["articles"]:
            text_key = "text_ar" if language == Language.ar else "text_fr"
            text = article[text_key]
            for key, val in user_fields.items():
                text = text.replace(f"[{key}]", str(val))
            # Replace remaining placeholders for optional fields with empty string
            for key, fm in metadata.items():
                if key not in user_fields and fm.get("required") is False:
                    text = text.replace(f"[{key}]", "")
            # Conditional blocks: drop the whole clause when the field is empty
            def _cond(match):
                field_key = match.group(1)
                return match.group(2) if user_fields.get(field_key, "") else ""
            text = _COND_RE.sub(_cond, text)
            # Safety net: strip any leftover [PLACEHOLDER] tokens
            text = _ORPHAN_RE.sub("", text)
            article[text_key] = text
            article["fields"] = []
    return data


def _fill_blank_template(template: Contract, language: Language) -> dict:
    """Replace [PLACEHOLDER] tokens with dotted lines for a printable blank template."""
    data = template.model_dump()
    data["disclaimer"] = ""
    for section in data["sections"]:
        for article in section["articles"]:
            text_key = "text_ar" if language == Language.ar else "text_fr"
            text = article[text_key]
            text = re.sub(r'\[([A-Z_]+)\]', '................................', text)
            article[text_key] = text
            article["fields"] = []
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
    extra_notes: str = "",
) -> list[ContractWarning]:
    """Review a filled contract with Gemini Flash for common user errors.

    Single LLM call: the model returns both real issues and (for Arabic)
    transliterations of Latin-script field values in one structured response,
    so transliteration is never dropped when other issues are present.
    """
    if not settings.gemini_api_key:
        return []

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

    def _safe(v: str) -> str:
        return v.replace("\n", " ").replace("\r", " ").replace("{", "(").replace("}", ")")[:200]

    fields_str = ", ".join(f"{k}={_safe(v)}" for k, v in list(user_fields.items())[:20])
    notes_str = f"\nNotes de l'utilisateur: {_safe(extra_notes)}" if extra_notes else ""

    translit_rule = """
7. TRANSLATIONS: pour chaque champ fourni dont la valeur contient du texte en alphabet latin (ex: 'ismi Ahmed', 'Rue 5 Janvier'), fournis la version arabe correcte. Ceci est OBLIGATOIRE, même si tu trouves d'autres problèmes.
""" if language == Language.ar else ""

    translations_schema = (
        "- \"translations\": TOUJOURS rempli — pour chaque champ en alphabet latin, sa version arabe (vide si aucun)."
        if language == Language.ar
        else "- \"translations\": laisse ce tableau vide."
    )

    prompt = f"""Avocat tunisien. Ce contrat vient d'être rempli. Signale UNIQUEMENT les vrais problèmes:
1. Champs obligatoires vides [CHAMP] dans le texte final
2. Valeurs incohérentes (ex: loyer 5 TND à Tunis)
3. Dates passées
4. Noms incomplets ou identiques entre parties
5. Incohérences entre type de contrat et valeurs
6. Valeurs mal formatées ou améliorables (ex: format de téléphone, majuscules, accents)
{translit_rule}
IMPORTANT: ne signale PAS dans "issues" les champs dont le texte est en alphabet latin
(français/darja) à convertir en arabe — ces conversions vont UNIQUEMENT dans "translations".
Ne commente pas les clauses standards, ni les références légales.

Pour chaque problème (issues), fournis:
- "value": la valeur corrigée concrète à utiliser. Si tu ne peux pas deviner la valeur
  (ex: il manque le nom de famille), mets "value" à "" et mets "correction_type": "manual"
- "correction_type": "auto" si la correction est applicable automatiquement (tu fournis la valeur),
  "manual" si l'utilisateur doit fournir l'information lui-même (nom manquant, adresse incomplète...),
  "info" si c'est juste une remarque sans action sur un champ

Réponds UNIQUEMENT avec un objet JSON (pas de markdown), contenant deux tableaux:
{{
  "issues": [{{"field":"NOM","severity":"error","message_fr":"...","message_ar":"...","suggestion_fr":"...","suggestion_ar":"...","value":"valeur corrigée","correction_type":"auto"}}],
  "translations": [{{"field":"NOM","value":"version arabe"}}]
}}
- "issues": les vrais problèmes (vide si tout va bien).
{translations_schema}
{"Tu es en mode arabe : les traductions doivent être en arabe." if language == Language.ar else ""}

Contrat: {title}
Champs fournis: {fields_str}{notes_str}
Texte: {contract_text}"""

    try:
        client = get_gemini_client()
        response = await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )
        text = response.text.strip()

        if "RIEN_A_SIGNALER" in text:
            return []

        clean = _extract_json(text)
        if not clean:
            return []
        raw = json.loads(clean)

        warnings: list[ContractWarning] = []

        if isinstance(raw, list):
            # Legacy format: issues only
            for w in raw:
                if isinstance(w, dict):
                    if "value" in w:
                        w["suggested_value"] = str(w["value"])
                    if "correction_type" not in w:
                        w["correction_type"] = "auto" if w.get("suggested_value", "") else "manual"
                    warnings.append(ContractWarning(**w))
        elif isinstance(raw, dict):
            for w in raw.get("issues", []) or []:
                if isinstance(w, dict):
                    if "value" in w:
                        w["suggested_value"] = str(w["value"])
                    if "correction_type" not in w:
                        w["correction_type"] = "auto" if w.get("suggested_value", "") else "manual"
                    warnings.append(ContractWarning(**w))
            # Translations: informational warnings, never errors.
            # Arabic mode only — a French contract must keep its values as typed.
            if language == Language.ar:
                translated_fields = {
                    item.get("field", "")
                    for item in raw.get("translations", []) or []
                    if isinstance(item, dict) and item.get("value")
                }
                # Safety net: drop issue entries that merely flag Latin-script text for
                # a field already covered by translations (avoids duplicate corrections)
                if translated_fields:
                    warnings = [
                        w
                        for w in warnings
                        if not (
                            w.field in translated_fields
                            and ("latin" in (w.message_fr or "").lower() or "لاتينية" in (w.message_ar or ""))
                        )
                    ]
                for item in raw.get("translations", []) or []:
                    if not isinstance(item, dict):
                        continue
                    field_key = item.get("field", "")
                    arabic = str(item.get("value", "")).strip()
                    original = user_fields.get(field_key, "")
                    if not field_key or not arabic or not original or arabic == original:
                        continue
                    warnings.append(
                        ContractWarning(
                            field=field_key,
                            severity="info",
                            message_ar="تحويل تلقائي إلى العربية",
                            message_fr="Conversion automatique en arabe",
                            suggestion_ar=f"«{original}» ← «{arabic}»",
                            suggestion_fr=f"«{original}» → «{arabic}»",
                            suggested_value=arabic,
                            correction_type="auto",
                        )
                    )
        return warnings

    except Exception as e:
        logger.warning("Contract review error: %s", str(e)[:200])

    return []


async def customize_blank_template(
    template_slug: str,
    language: Language,
    prompt: str,
) -> dict:
    """Use Gemini to customize a blank template based on user prompt. One-time use."""
    if template_slug in _customize_usage:
        raise RuntimeError("This template has already been customized (one-time limit per session)")
    if not settings.gemini_api_key:
        raise RuntimeError("Gemini API key not configured")

    await ensure_seeded()
    t = await get_template(template_slug)
    if not t:
        raise ValueError("Template not found")

    contract = Contract(**t)
    blank = _fill_blank_template(contract, language)

    tkey = "text_ar" if language == Language.ar else "text_fr"

    # Format articles with explicit section/article markers
    formatted = []
    article_map = {}
    for s in blank.get("sections", []):
        for a in s.get("articles", []):
            text = a.get(tkey, "")
            if text.strip():
                marker = f"ARTICLE::{a['id']}"
                formatted.append(f"{marker}\n{text}\n{marker}")
                article_map[a["id"]] = {"section": s, "article": a}

    full_text = "\n\n".join(formatted)
    title = blank.get("title_fr" if language == Language.fr else "title_ar", "")

    gpt_prompt = f"""Avocat tunisien. Voici un modèle de contrat vierge tunisien: {title}.
L'utilisateur demande la modification suivante: {prompt}

Modifie UNIQUEMENT le texte entre les balises ARTICLE::id.
Garde les balises ARTICLE::id intactes (ne les modifie pas, ne les déplace pas).
Les ................................ sont des champs à remplir plus tard — garde-les.
Ne retire aucune clause existante sauf demande explicite de l'utilisateur.
Respecte le style juridique tunisien. Sois concis.

Retourne TOUT le texte, incluant les balises ARTICLE::id, sans commentaires."""

    try:
        client = get_gemini_client()
        response = await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=gpt_prompt,
        )
        modified_text = response.text.strip()

        pattern = re.compile(r"ARTICLE::(\S+)\n(.*?)\nARTICLE::\1", re.DOTALL)
        matches = pattern.findall(modified_text)

        if not matches:
            # Fallback: if markers were lost, keep the original blank
            logger.warning("Customize markers lost, returning original blank")
            blank["modified_by_ai"] = True
            _customize_usage.add(template_slug)
            return blank

        modified_map = {aid: text.strip() for aid, text in matches}

        # Apply modifications back to the sections
        output_sections = []
        for s in blank.get("sections", []):
            new_articles = []
            for a in s.get("articles", []):
                if a["id"] in modified_map:
                    a[tkey] = modified_map[a["id"]]
                new_articles.append(a)
            output_sections.append({**s, "articles": new_articles})

        blank["sections"] = output_sections
        blank["modified_by_ai"] = True
        _customize_usage.add(template_slug)
        return blank

    except Exception as e:
        logger.warning("Blank template customization error: %s", str(e)[:200])
        raise RuntimeError(f"Customization failed: {str(e)[:200]}")


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
