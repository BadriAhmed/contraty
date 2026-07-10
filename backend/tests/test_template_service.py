"""Tests for template_service business logic layer."""

import pytest
from unittest.mock import AsyncMock, patch

from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository
from app.services.template_service import (
    set_template_repo,
    set_contract_repo,
    ensure_seeded,
    list_templates,
    get_template,
    generate_contract,
    generate_pdf,
)
from app.models.generation import GenerateRequest
from app.models.contract import Language
from tests.conftest import SAMPLE_TEMPLATE, SAMPLE_TEMPLATE_2


@pytest.fixture(autouse=True)
def clean_repos(seeded_repo):
    set_template_repo(seeded_repo)
    set_contract_repo(InMemoryContractRepository())


@pytest.mark.unit
async def test_ensure_seeded_already_seeded(seeded_repo):
    await ensure_seeded()
    templates = await seeded_repo.list_all()
    assert len(templates) == 2


@pytest.mark.unit
async def test_list_templates_all():
    templates = await list_templates()
    assert len(templates) == 2
    slugs = {t["slug"] for t in templates}
    assert slugs == {"bail-habitation", "contrat-cdi"}


@pytest.mark.unit
async def test_list_templates_filtered():
    templates = await list_templates(domain="travail")
    assert len(templates) == 1
    assert templates[0]["slug"] == "contrat-cdi"


@pytest.mark.unit
async def test_get_template_exists():
    t = await get_template("bail-habitation")
    assert t is not None
    assert t["slug"] == "bail-habitation"
    assert t["field_count"] == 5


@pytest.mark.unit
async def test_get_template_not_found():
    t = await get_template("nope")
    assert t is None


@pytest.mark.unit
async def test_generate_contract_template_not_found():
    req = GenerateRequest(contract_slug="nope", language=Language.fr, user_fields={"X": "Y"})
    result = await generate_contract(req)
    assert result["success"] is False
    assert "not found" in result["error"].lower()


@pytest.mark.unit
async def test_generate_contract_success():
    with patch("app.services.template_service.llm_router.generate", new_callable=AsyncMock) as mock_llm:
        from app.models.contract import ContractResponse, Contract
        contract = Contract(**SAMPLE_TEMPLATE)
        mock_llm.return_value = ContractResponse(
            success=True,
            contract=contract,
            model_used="test-model",
            language=Language.fr,
        )

        req = GenerateRequest(
            contract_slug="bail-habitation",
            language=Language.fr,
            user_fields={"NOM_BAILLEUR": "Ali Ben Salah"},
        )
        result = await generate_contract(req)

        assert result["success"] is True
        assert result["contract"] is not None
        assert result["model_used"] == "test-model"
        assert result["generation_time_ms"] >= 0
        assert result["fallback_attempted"] is False


@pytest.mark.unit
async def test_generate_contract_fallback():
    with patch("app.services.template_service.llm_router.generate", new_callable=AsyncMock) as mock_llm:
        from app.models.contract import ContractResponse
        mock_llm.return_value = ContractResponse(
            success=True,
            model_used="openai",
            language=Language.fr,
            fallback_attempted=True,
        )

        req = GenerateRequest(
            contract_slug="bail-habitation",
            language=Language.fr,
            user_fields={"NOM_BAILLEUR": "Ali"},
        )
        result = await generate_contract(req)

        assert result["success"] is True
        assert result["model_used"] == "openai"
        assert result["fallback_attempted"] is True


@pytest.mark.unit
async def test_generate_contract_llm_failure():
    with patch("app.services.template_service.llm_router.generate", new_callable=AsyncMock) as mock_llm:
        from app.models.contract import ContractResponse
        mock_llm.return_value = ContractResponse(
            success=False,
            error="Rate limit exceeded",
            language=Language.fr,
        )

        req = GenerateRequest(
            contract_slug="bail-habitation",
            language=Language.fr,
            user_fields={"NOM_BAILLEUR": "Ali"},
        )
        result = await generate_contract(req)

        assert result["success"] is False
        assert result["error"] is not None
        assert result["contract"] is None


@pytest.mark.unit
async def test_generate_pdf_returns_bytes(filled_template):
    pdf_bytes = await generate_pdf(filled_template, "fr", "bail-habitation")
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes[:4] == b"%PDF"


@pytest.mark.unit
async def test_generate_pdf_arabic(filled_template):
    pdf_bytes = await generate_pdf(filled_template, "ar", "bail-habitation")
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes[:4] == b"%PDF"


@pytest.mark.unit
async def test_generate_pdf_invalid_language(filled_template):
    with pytest.raises(ValueError):
        await generate_pdf(filled_template, "de", "bail-habitation")


@pytest.mark.unit
async def test_list_templates_does_not_mutate(seeded_repo):
    before = await seeded_repo.list_all()
    templates = await list_templates()
    after = await seeded_repo.list_all()
    assert len(before) == len(after)
    assert len(templates) == len(before)
