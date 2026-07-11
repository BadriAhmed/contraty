"""Seed Supabase with the 22 contract templates from data/templates/*.json.

Usage:
    python -m app.db.seed

Reads template JSON files, computes complexity and field_count,
and inserts into the templates table via the repository layer.
Also chunks each template by article for embedding search.
"""

import json
import logging
import asyncio
from pathlib import Path

from app.db.memory import InMemoryTemplateRepository

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data" / "templates"
if not TEMPLATES_DIR.exists():
    # Docker fallback: templates are at /app/data/templates
    TEMPLATES_DIR = Path("/app/data/templates")
if not TEMPLATES_DIR.exists():
    # Local development fallback
    TEMPLATES_DIR = Path("data/templates")


def compute_complexity(field_count: int) -> str:
    if field_count <= 12:
        return "low"
    elif field_count <= 20:
        return "medium"
    return "high"


def deduplicate_fields(sections: list[dict]) -> int:
    seen = set()
    for sec in sections or []:
        for art in sec.get("articles") or []:
            for f in art.get("fields") or []:
                seen.add(f)
    return len(seen)


def chunk_template(template: dict) -> list[dict]:
    """Split a template into one chunk per article."""
    chunks = []
    idx = 0
    for section in template.get("sections") or []:
        for article in section.get("articles") or []:
            chunks.append({
                "template_slug": template["slug"],
                "chunk_index": idx,
                "section_id": section.get("id", ""),
                "article_id": article.get("id", ""),
                "text_fr": article.get("text_fr", ""),
                "text_ar": article.get("text_ar", ""),
            })
            idx += 1
    return chunks


async def seed_templates(repository=None):
    if repository is None:
        repository = InMemoryTemplateRepository()

    if not TEMPLATES_DIR.exists():
        logger.warning("Templates directory not found: %s", TEMPLATES_DIR)
        return 0

    count = 0
    all_chunks = []

    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            logger.warning("Failed to read %s: %s", path.name, e)
            continue

        field_count = deduplicate_fields(data.get("sections", []))
        complexity = compute_complexity(field_count)

        template = {
            "id": data.get("id", f"{data.get('slug', path.stem)}-v1"),
            "slug": data["slug"],
            "title_ar": data.get("title_ar", ""),
            "title_fr": data.get("title_fr", ""),
            "description_ar": data.get("description_ar", ""),
            "description_fr": data.get("description_fr", ""),
            "domain": data.get("category", "logement"),
            "legal_basis": data.get("legal_basis", ""),
            "version": data.get("version", "1.0"),
            "reviewed_by": data.get("reviewed_by"),
            "review_date": data.get("review_date"),
            "source": data.get("source", "public_examples"),
            "disclaimer": data.get("disclaimer", ""),
            "sections": data.get("sections", []),
            "complexity": complexity,
            "field_count": field_count,
            "field_metadata": data.get("field_metadata", {}),
        }

        await repository.upsert(template)
        all_chunks.extend(chunk_template(data))
        count += 1

    if hasattr(repository, "load_chunks"):
        repository.load_chunks(all_chunks)

    logger.info("Seeded %d templates with %d chunks", count, len(all_chunks))
    return count


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_templates())
