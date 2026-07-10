"""Tests for LLM router — model selection, fallback, error handling."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.models.contract import Language, ContractResponse


@pytest.fixture
def router():
    from app.services.llm import LLMRouter
    return LLMRouter()


@pytest.mark.unit
def test_primary_model_french(router):
    assert router._primary_model(Language.fr) == "mistral"


@pytest.mark.unit
def test_primary_model_arabic(router):
    assert router._primary_model(Language.ar) == "gemini"


@pytest.mark.unit
def test_fallback_model(router):
    assert router._fallback_model(Language.fr) == "openai"
    assert router._fallback_model(Language.ar) == "openai"


@pytest.mark.unit
async def test_mistral_call_success(router):
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = '{"id": "test-v1", "slug": "test", "title_ar": "", "title_fr": "", "domain": "logement"}'

    with patch.object(router, "_call_mistral", new_callable=AsyncMock) as mock_call:
        mock_call.return_value = mock_response.choices[0].message.content

        result = await router._try_model("test prompt", Language.fr, "mistral")
        assert result.success is True
        assert result.language == Language.fr


@pytest.mark.unit
async def test_unknown_model_returns_error(router):
    result = await router._try_model("test", Language.fr, "nonexistent")
    assert result.success is False
    assert "Unknown model" in result.error


@pytest.mark.unit
async def test_parse_invalid_json(router):
    result = router._parse_contract_json("not json at all")
    assert result is None


@pytest.mark.unit
async def test_parse_json_with_markdown_fence(router):
    json_str = '```json\n{"id": "test", "slug": "t", "title_ar": "", "title_fr": "", "domain": "logement"}\n```'
    result = router._parse_contract_json(json_str)
    assert result is not None
    assert result.slug == "t"


@pytest.mark.unit
async def test_parse_valid_contract_json(router):
    from app.models.contract import Contract
    c = Contract(id="x", slug="test", domain="logement")
    json_str = c.model_dump_json()
    result = router._parse_contract_json(json_str)
    assert result is not None
    assert result.slug == "test"


@pytest.mark.unit
async def test_parser_handles_whitespace(router):
    json_str = '\n\n  {"id": "test", "slug": "x", "title_ar": "", "title_fr": "", "domain": "logement"}  \n\n'
    result = router._parse_contract_json(json_str)
    assert result is not None
    assert result.slug == "x"
