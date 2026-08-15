import math
import logging
from google.genai import Client as GenAIClient
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class VectorStore:
    """Gemini-powered text embeddings (text-embedding-004, 768 dims)."""

    def __init__(self):
        self._gemini: GenAIClient | None = None

    @property
    def client(self) -> GenAIClient:
        if self._gemini is None:
            self._gemini = GenAIClient(api_key=settings.gemini_api_key)
        return self._gemini

    async def embed(self, texts: list[str]) -> list[list[float]]:
        response = await self.client.aio.models.embed_content(
            model=settings.embedding_model,
            contents=texts,
        )
        return [e.values for e in response.embeddings]

    async def embed_single(self, text: str) -> list[float]:
        results = await self.embed([text])
        return results[0]

    @staticmethod
    def cosine_similarity(a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)


vector_store = VectorStore()
