"""Supabase-backed repositories.

Active when SUPABASE_URL is configured. Delegates all operations
to Supabase REST API + pgvector for embedding search.
"""

import copy
import logging
from typing import Optional

from app.core.config import get_settings
from app.db.client import get_supabase
from app.db.repository import TemplateRepository, ContractRepository

logger = logging.getLogger(__name__)
settings = get_settings()


class SupabaseTemplateRepository(TemplateRepository):
    async def list_all(self, domain: Optional[str] = None, language: Optional[str] = None) -> list[dict]:
        client = get_supabase()
        if client is None:
            return []
        query = client.table("templates").select("*").order("title_fr")
        if domain:
            query = query.eq("domain", domain)
        result = query.execute()
        return result.data or []

    async def get_by_slug(self, slug: str) -> Optional[dict]:
        client = get_supabase()
        if client is None:
            return None
        result = client.table("templates").select("*").eq("slug", slug).limit(1).execute()
        rows = result.data or []
        return copy.deepcopy(rows[0]) if rows else None

    async def upsert(self, template: dict) -> dict:
        client = get_supabase()
        if client is None:
            raise RuntimeError("Supabase client not available")
        result = client.table("templates").upsert(template, on_conflict="slug").execute()
        return result.data[0] if result.data else template

    async def delete(self, slug: str) -> bool:
        client = get_supabase()
        if client is None:
            return False
        result = client.table("templates").delete().eq("slug", slug).execute()
        return len(result.data or []) > 0

    async def search_by_embedding(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        client = get_supabase()
        if client is None:
            return []
        result = client.rpc(
            "match_template_chunks",
            {
                "query_embedding": query_embedding,
                "match_threshold": settings.vector_similarity_threshold,
                "match_count": top_k,
            },
        ).execute()
        return result.data or []


class SupabaseContractRepository(ContractRepository):
    async def save(self, contract: dict) -> dict:
        client = get_supabase()
        if client is None:
            raise RuntimeError("Supabase client not available")
        result = client.table("contracts").insert(contract).execute()
        return result.data[0] if result.data else contract

    async def get_by_id(self, contract_id: str) -> Optional[dict]:
        client = get_supabase()
        if client is None:
            return None
        result = client.table("contracts").select("*").eq("id", contract_id).limit(1).execute()
        rows = result.data or []
        return copy.deepcopy(rows[0]) if rows else None

    async def list_by_user(self, user_id: str, limit: int = 20) -> list[dict]:
        client = get_supabase()
        if client is None:
            return []
        result = (
            client.table("contracts")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []

    async def delete(self, contract_id: str) -> bool:
        client = get_supabase()
        if client is None:
            return False
        result = client.table("contracts").delete().eq("id", contract_id).execute()
        return len(result.data or []) > 0
