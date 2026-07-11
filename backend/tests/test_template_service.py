"""Tests for template_service business logic layer."""

import pytest

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
    req = GenerateRequest(
        contract_slug="bail-habitation",
        language=Language.fr,
        user_fields={"NOM_BAILLEUR": "Ali Ben Salah"},
    )
    result = await generate_contract(req)

    assert result["success"] is True
    assert result["contract"] is not None
    assert result["model_used"] == "template-engine"
    assert result["generation_time_ms"] >= 0
    assert result["fallback_attempted"] is False
    assert result["error"] is None


@pytest.mark.unit
async def test_generate_contract_placeholder_substitution():
    req = GenerateRequest(
        contract_slug="bail-habitation",
        language=Language.fr,
        user_fields={"NOM_BAILLEUR": "Ali Ben Salah"},
    )
    result = await generate_contract(req)
    assert result["success"] is True
    first_article = result["contract"]["sections"][0]["articles"][0]
    assert "Ali Ben Salah" in first_article["text_fr"]
    assert "[NOM_BAILLEUR]" not in first_article["text_fr"]
    assert first_article["fields"] == []


@pytest.mark.unit
async def test_generate_contract_no_fields_provided():
    """When no user_fields are provided, placeholders remain."""
    req = GenerateRequest(
        contract_slug="bail-habitation",
        language=Language.fr,
        user_fields={},
    )
    result = await generate_contract(req)
    assert result["success"] is True
    first_article = result["contract"]["sections"][0]["articles"][0]
    assert "[NOM_BAILLEUR]" in first_article["text_fr"]


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
