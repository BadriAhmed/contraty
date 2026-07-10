import json
import logging
from pathlib import Path
from typing import Optional
from app.models.contract import Contract, Language

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data" / "templates"


class RAGService:
    def __init__(self):
        self._templates: dict[str, Contract] = {}
        self._loaded = False

    def _ensure_loaded(self):
        if self._loaded:
            return
        if not TEMPLATES_DIR.exists():
            logger.warning("Templates directory not found: %s", TEMPLATES_DIR)
            self._loaded = True
            return
        for path in TEMPLATES_DIR.glob("*.json"):
            try:
                template = Contract.model_validate_json(path.read_text(encoding="utf-8"))
                self._templates[template.slug] = template
            except Exception as e:
                logger.warning("Failed to load template %s: %s", path.name, e)
        self._loaded = True
        logger.info("Loaded %d templates from %s", len(self._templates), TEMPLATES_DIR)

    async def search(
        self, contract_slug: str, language: Language, top_k: int = 3
    ) -> Optional[Contract]:
        self._ensure_loaded()
        return self._templates.get(contract_slug)

    def list_templates(
        self, domain: Optional[str] = None, language: Optional[Language] = None
    ) -> list[Contract]:
        self._ensure_loaded()
        results = list(self._templates.values())
        if domain:
            results = [t for t in results if t.domain == domain]
        return results

    def template_count(self) -> int:
        self._ensure_loaded()
        return len(self._templates)


rag_service = RAGService()
