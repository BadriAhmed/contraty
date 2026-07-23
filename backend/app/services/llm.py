import time
import logging
from openai import OpenAI
from mistralai.client import Mistral
from mistralai.client.models import UserMessage
from google.genai import Client as GenAIClient

from app.core.config import get_settings
from app.models.contract import Language, Contract, ContractResponse

logger = logging.getLogger(__name__)
settings = get_settings()

_gemini_client: GenAIClient | None = None


def get_gemini_client() -> GenAIClient:
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GenAIClient(api_key=settings.gemini_api_key)
    return _gemini_client


def _extract_json(text: str) -> str:
    if not text:
        return ""
    text = text.strip()
    start = text.find("```")
    if start != -1:
        after_start = text.find("\n", start)
        if after_start == -1:
            return text[:start].strip()
        end = text.rfind("```")
        if end > after_start:
            text = text[after_start:end].strip()
        else:
            text = text[after_start:].strip()
    return text


class LLMRouter:
    def __init__(self):
        self._openai: OpenAI | None = None
        self._mistral: Mistral | None = None
        self._gemini_configured = False
        self._gemini_client: GenAIClient | None = None

    @property
    def openai_client(self) -> OpenAI:
        if self._openai is None:
            self._openai = OpenAI(api_key=settings.openai_api_key)
        return self._openai

    @property
    def mistral_client(self) -> Mistral:
        if self._mistral is None:
            self._mistral = Mistral(api_key=settings.mistral_api_key)
        return self._mistral

    def _ensure_gemini(self):
        if not self._gemini_configured:
            self._gemini_client = get_gemini_client()
            self._gemini_configured = True

    def _primary_model(self, language: Language) -> str:
        return "mistral" if language == Language.fr else "gemini"

    def _fallback_model(self, language: Language) -> str:
        return "openai"

    async def generate(
        self, prompt: str, language: Language, max_attempts: int = 3
    ) -> ContractResponse:
        primary = self._primary_model(language)

        result = await self._try_model(prompt, language, primary)
        if result.success:
            result.model_used = primary
            return result

        fallback = self._fallback_model(language)
        for attempt in range(max_attempts - 1):
            logger.warning(
                "Primary model %s failed, falling back to %s (attempt %d/%d)",
                primary, fallback, attempt + 2, max_attempts,
            )
            result = await self._try_model(prompt, language, fallback)
            if result.success:
                result.model_used = fallback
                result.fallback_attempted = True
                return result

        return ContractResponse(
            success=False,
            error=f"All models failed after {max_attempts} total attempts",
            language=language,
            fallback_attempted=True,
        )

    async def _try_model(
        self, prompt: str, language: Language, model: str
    ) -> ContractResponse:
        try:
            if model == "mistral":
                response = await self._call_mistral(prompt)
            elif model == "gemini":
                response = await self._call_gemini(prompt)
            elif model == "openai":
                response = await self._call_openai(prompt)
            else:
                return ContractResponse(
                    success=False,
                    error=f"Unknown model: {model}",
                    language=language,
                )

            contract = self._parse_contract_json(response)
            if contract is None:
                return ContractResponse(
                    success=False,
                    error="Model output could not be parsed as valid contract JSON",
                    language=language,
                )

            return ContractResponse(success=True, contract=contract, language=language)

        except Exception as e:
            logger.error("Model %s failed: %s", model, str(e))
            return ContractResponse(
                success=False, error=str(e), language=language
            )

    async def _call_mistral(self, prompt: str) -> str:
        response = await self.mistral_client.chat.complete_async(
            model=settings.mistral_model,
            messages=[UserMessage(content=prompt)],
            temperature=0.3,
        )
        return response.choices[0].message.content

    async def _call_gemini(self, prompt: str) -> str:
        self._ensure_gemini()
        response = await self._gemini_client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )
        return response.text

    async def _call_openai(self, prompt: str) -> str:
        response = self.openai_client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        return response.choices[0].message.content or ""

    def _parse_contract_json(self, text: str) -> Contract | None:
        try:
            clean = _extract_json(text)
            return Contract.model_validate_json(clean)
        except Exception as e:
            logger.warning("Failed to parse contract JSON: %s", str(e))
            return None


router = LLMRouter()
