"""Tests for fallback chain, edge cases, and error scenarios."""

import pytest
from unittest.mock import AsyncMock, patch

from app.models.contract import Language


@pytest.fixture
def router():
    from app.services.llm import LLMRouter
    return LLMRouter()


@pytest.mark.unit
async def test_generate_with_both_models_failing(router):
    with patch.object(router, "_try_model", new_callable=AsyncMock) as mock_try:
        from app.models.contract import ContractResponse
        mock_try.return_value = ContractResponse(
            success=False,
            error="Model error",
            language=Language.fr,
        )

        result = await router.generate("prompt", Language.fr, max_attempts=2)
        assert result.success is False
        assert "All models failed" in result.error
        assert result.fallback_attempted is True
        assert mock_try.call_count == 2


@pytest.mark.unit
async def test_fallback_chain_stops_on_success(router):
    call_count = 0

    async def flaky_try(prompt, language, model):
        nonlocal call_count
        call_count += 1
        from app.models.contract import ContractResponse
        if call_count == 3:
            return ContractResponse(success=True, language=Language.fr)
        return ContractResponse(success=False, error="failed", language=Language.fr)

    with patch.object(router, "_try_model", side_effect=flaky_try):
        result = await router.generate("prompt", Language.fr, max_attempts=3)
        assert result.success is True
        assert result.fallback_attempted is True
        assert call_count == 3


@pytest.mark.unit
async def test_extract_json_handles_backticks(router):
    text = 'Here is some text\n```\n{"id":"x","slug":"s","title_ar":"","title_fr":"","domain":"logement"}\n```'
    result = router._parse_contract_json(text)
    assert result is not None
    assert result.slug == "s"


@pytest.mark.unit
async def test_extract_json_no_backticks(router):
    text = '{"id":"x","slug":"s","title_ar":"","title_fr":"","domain":"logement"}'
    result = router._parse_contract_json(text)
    assert result is not None
    assert result.slug == "s"


@pytest.mark.unit
async def test_extract_json_empty_string(router):
    result = router._parse_contract_json("")
    assert result is None


@pytest.mark.unit
async def test_extract_json_none(router):
    result = router._parse_contract_json(None)
    assert result is None


@pytest.mark.unit
async def test_generate_preserves_language_in_response(router):
    with patch.object(router, "_try_model", new_callable=AsyncMock) as mock_try:
        from app.models.contract import ContractResponse
        mock_try.return_value = ContractResponse(
            success=True,
            language=Language.ar,
        )

        result = await router.generate("prompt", Language.ar)
        assert result.language == Language.ar


@pytest.mark.unit
async def test_gemini_call_exception_handled(router):
    with patch.object(router, "_call_gemini", new_callable=AsyncMock) as mock_gemini:
        mock_gemini.side_effect = RuntimeError("API quota exceeded")

        result = await router._try_model("prompt", Language.ar, "gemini")
        assert result.success is False
        assert "API quota exceeded" in result.error
        assert result.language == Language.ar
