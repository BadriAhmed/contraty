from abc import ABC, abstractmethod
from typing import Optional


class TemplateRepository(ABC):
    @abstractmethod
    async def list_all(self, domain: Optional[str] = None, language: Optional[str] = None) -> list[dict]:
        ...

    @abstractmethod
    async def get_by_slug(self, slug: str) -> Optional[dict]:
        ...

    @abstractmethod
    async def upsert(self, template: dict) -> dict:
        ...

    @abstractmethod
    async def delete(self, slug: str) -> bool:
        ...

    @abstractmethod
    async def search_by_embedding(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        ...


class ContractRepository(ABC):
    @abstractmethod
    async def save(self, contract: dict) -> dict:
        ...

    @abstractmethod
    async def get_by_id(self, contract_id: str) -> Optional[dict]:
        ...

    @abstractmethod
    async def list_by_user(self, user_id: str, limit: int = 20) -> list[dict]:
        ...

    @abstractmethod
    async def delete(self, contract_id: str) -> bool:
        ...
