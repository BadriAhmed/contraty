"""In-memory repository for development and testing.

Used when SUPABASE_URL is not configured. Provides the same interface
as the Supabase-backed repository so app code doesn't need to care
which backend is active.
"""

import copy
from typing import Optional

from app.db.repository import TemplateRepository, ContractRepository


class InMemoryTemplateRepository(TemplateRepository):
    def __init__(self):
        self._templates: dict[str, dict] = {}
        self._chunks: list[dict] = []

    async def list_all(self, domain: Optional[str] = None, language: Optional[str] = None) -> list[dict]:
        results = list(self._templates.values())
        if domain:
            results = [t for t in results if t.get("domain") == domain]
        return results

    async def get_by_slug(self, slug: str) -> Optional[dict]:
        return copy.deepcopy(self._templates.get(slug))

    async def upsert(self, template: dict) -> dict:
        slug = template["slug"]
        template["updated_at"] = "now()"
        self._templates[slug] = copy.deepcopy(template)
        return self._templates[slug]

    async def delete(self, slug: str) -> bool:
        return self._templates.pop(slug, None) is not None

    async def search_by_embedding(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        # Naive: return first top_k chunks (no actual similarity in in-memory mode)
        return self._chunks[:top_k]

    def load_chunks(self, chunks: list[dict]):
        self._chunks = chunks


class InMemoryContractRepository(ContractRepository):
    def __init__(self):
        self._contracts: dict[str, dict] = {}
        self._counter = 0

    async def save(self, contract: dict) -> dict:
        self._counter += 1
        cid = contract.get("id") or f"c-{self._counter}"
        contract["id"] = cid
        contract["created_at"] = "now()"
        self._contracts[cid] = copy.deepcopy(contract)
        return self._contracts[cid]

    async def get_by_id(self, contract_id: str) -> Optional[dict]:
        return copy.deepcopy(self._contracts.get(contract_id))

    async def list_by_user(self, user_id: str, limit: int = 20) -> list[dict]:
        return [c for c in self._contracts.values() if c.get("user_id") == user_id][:limit]

    async def delete(self, contract_id: str) -> bool:
        return self._contracts.pop(contract_id, None) is not None
