import math
import logging
from openai import OpenAI
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class VectorStore:
    def __init__(self):
        self._openai: OpenAI | None = None

    @property
    def client(self) -> OpenAI:
        if self._openai is None:
            self._openai = OpenAI(api_key=settings.openai_api_key)
        return self._openai

    async def embed(self, texts: list[str]) -> list[list[float]]:
        response = self.client.embeddings.create(
            model=settings.embedding_model,
            input=texts,
            dimensions=settings.embedding_dimensions,
        )
        return [d.embedding for d in response.data]

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
