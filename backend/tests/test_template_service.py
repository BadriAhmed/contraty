"""Tests for template_service business logic layer."""

import json
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
    validate_user_fields,
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
    """When no user_fields are provided, the safety net strips placeholders."""
    req = GenerateRequest(
        contract_slug="bail-habitation",
        language=Language.fr,
        user_fields={},
    )
    result = await generate_contract(req)
    assert result["success"] is True
    first_article = result["contract"]["sections"][0]["articles"][0]
    assert "[NOM_BAILLEUR]" not in first_article["text_fr"]


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


@pytest.mark.unit
async def test_fill_template_conditional_block_kept_when_filled():
    """Optional clause wrapped in {{#FIELD}}...{{/FIELD}} is kept when the field has a value."""
    from app.services.template_service import _fill_template
    from app.models.contract import Contract, TemplateSection, TemplateArticle, FieldMetadata

    contract = Contract(
        id="test-cond",
        slug="test-cond",
        title_fr="Test",
        sections=[
            TemplateSection(
                id="s1",
                title_fr="Section",
                articles=[
                    TemplateArticle(
                        id="a1",
                        text_fr="Bonjour{{#MOTIF}} pour motif : [MOTIF].{{/MOTIF}} Fin.",
                        fields=["MOTIF"],
                    )
                ],
            )
        ],
        field_metadata={"MOTIF": FieldMetadata(label_fr="Motif", required=False)},
    )
    result = _fill_template(contract, {"MOTIF": "départ"}, Language.fr)
    text = result["sections"][0]["articles"][0]["text_fr"]
    assert "pour motif : départ." in text
    assert "{{" not in text and "}}" not in text


@pytest.mark.unit
async def test_fill_template_conditional_block_removed_when_empty():
    """Optional clause is removed entirely when the field is omitted."""
    from app.services.template_service import _fill_template
    from app.models.contract import Contract, TemplateSection, TemplateArticle, FieldMetadata

    contract = Contract(
        id="test-cond",
        slug="test-cond",
        title_fr="Test",
        sections=[
            TemplateSection(
                id="s1",
                title_fr="Section",
                articles=[
                    TemplateArticle(
                        id="a1",
                        text_fr="Bonjour{{#MOTIF}} pour motif : [MOTIF].{{/MOTIF}} Fin.",
                        fields=["MOTIF"],
                    )
                ],
            )
        ],
        field_metadata={"MOTIF": FieldMetadata(label_fr="Motif", required=False)},
    )
    result = _fill_template(contract, {}, Language.fr)
    text = result["sections"][0]["articles"][0]["text_fr"]
    assert "pour motif" not in text
    assert "[MOTIF]" not in text
    assert "{{" not in text and "}}" not in text


@pytest.mark.unit
async def test_fill_template_strips_orphan_placeholders():
    """Unreplaced [PLACEHOLDER] tokens are stripped by the safety net."""
    from app.services.template_service import _fill_template
    from app.models.contract import Contract, TemplateSection, TemplateArticle

    contract = Contract(
        id="test-orphan",
        slug="test-orphan",
        title_fr="Test",
        sections=[
            TemplateSection(
                id="s1",
                title_fr="Section",
                articles=[
                    TemplateArticle(id="a1", text_fr="Salut [GHOST_FIELD] bye.", fields=[]),
                ],
            )
        ],
    )
    result = _fill_template(contract, {}, Language.fr)
    text = result["sections"][0]["articles"][0]["text_fr"]
    assert "[GHOST_FIELD]" not in text


def _fake_gemini(text: str):
    """Return a fake Gemini client whose aio API returns the given text."""
    from types import SimpleNamespace
    from unittest.mock import AsyncMock

    response = SimpleNamespace(text=text)
    content = AsyncMock(return_value=response)
    models = SimpleNamespace(generate_content=content)
    aio = SimpleNamespace(models=models)
    return SimpleNamespace(aio=aio)


@pytest.mark.unit
async def test_review_contract_parses_two_part_response(monkeypatch):
    """Issues + translations parsed from one structured response."""
    from app.services.template_service import review_contract
    from app.services import template_service

    monkeypatch.setattr(template_service.settings, "gemini_api_key", "test-key")
    payload = json.dumps(
        {
            "issues": [
                {
                    "field": "DATE_DEBUT",
                    "severity": "error",
                    "message_fr": "Date passée",
                    "message_ar": "تاريخ منقضٍ",
                    "suggestion_fr": "Mettre à jour",
                    "suggestion_ar": "حدّث التاريخ",
                    "value": "",
                    "correction_type": "manual",
                }
            ],
            "translations": [{"field": "NOM_BAILLEUR", "value": "علي بن صالح"}],
        }
    )
    monkeypatch.setattr(template_service, "get_gemini_client", lambda: _fake_gemini(payload))

    warnings = await review_contract(
        {"title_fr": "Test", "sections": []},
        Language.ar,
        {"NOM_BAILLEUR": "Ali Ben Salah"},
    )

    assert len(warnings) == 2
    issue = warnings[0]
    assert issue.field == "DATE_DEBUT"
    assert issue.severity == "error"
    assert issue.correction_type == "manual"
    translation = warnings[1]
    assert translation.field == "NOM_BAILLEUR"
    assert translation.severity == "info"
    assert translation.correction_type == "auto"
    assert translation.suggested_value == "علي بن صالح"


@pytest.mark.unit
async def test_review_contract_translations_even_when_no_issues(monkeypatch):
    """Translations are kept even when the issues array is empty."""
    from app.services.template_service import review_contract
    from app.services import template_service

    monkeypatch.setattr(template_service.settings, "gemini_api_key", "test-key")
    payload = json.dumps(
        {
            "issues": [],
            "translations": [{"field": "ADRESSE_BIEN", "value": "نهج الحبيب بورقيبة 5، تونس"}],
        }
    )
    monkeypatch.setattr(template_service, "get_gemini_client", lambda: _fake_gemini(payload))

    warnings = await review_contract(
        {"title_fr": "Test", "sections": []},
        Language.ar,
        {"ADRESSE_BIEN": "Rue Habib Bourguiba 5, Tunis"},
    )

    assert len(warnings) == 1
    assert warnings[0].severity == "info"
    assert warnings[0].suggested_value == "نهج الحبيب بورقيبة 5، تونس"


@pytest.mark.unit
async def test_review_contract_legacy_array_format(monkeypatch):
    """Old single-array responses still parse as issues only."""
    from app.services.template_service import review_contract
    from app.services import template_service

    monkeypatch.setattr(template_service.settings, "gemini_api_key", "test-key")
    payload = json.dumps(
        [
            {
                "field": "CIN_BAILLEUR",
                "severity": "error",
                "message_fr": "CIN invalide",
                "message_ar": "بطاقة تعريف غير صالحة",
                "suggestion_fr": "",
                "suggestion_ar": "",
                "value": "01234567",
                "correction_type": "auto",
            }
        ]
    )
    monkeypatch.setattr(template_service, "get_gemini_client", lambda: _fake_gemini(payload))

    warnings = await review_contract(
        {"title_fr": "Test", "sections": []},
        Language.fr,
        {"CIN_BAILLEUR": "12345"},
    )

    assert len(warnings) == 1
    assert warnings[0].field == "CIN_BAILLEUR"
    assert warnings[0].suggested_value == "01234567"


@pytest.mark.unit
async def test_review_contract_rien_a_signal_returns_empty(monkeypatch):
    """RIEN_A_SIGNALER response returns no warnings."""
    from app.services.template_service import review_contract
    from app.services import template_service

    monkeypatch.setattr(template_service.settings, "gemini_api_key", "test-key")
    monkeypatch.setattr(template_service, "get_gemini_client", lambda: _fake_gemini("RIEN_A_SIGNALER"))

    warnings = await review_contract(
        {"title_fr": "Test", "sections": []},
        Language.fr,
        {"NOM_BAILLEUR": "Ali"},
    )

    assert warnings == []


@pytest.mark.unit
def test_validate_user_fields_required_pattern_and_ranges():
    metadata = {
        "CIN": {"type": "cin", "required": True, "pattern": r"^\d{8}$"},
        "AGE": {"type": "number", "min_value": 0, "max_value": 120},
        "NOTE": {"type": "text", "required": False},
    }

    # Valid
    assert validate_user_fields(metadata, {"CIN": "12345678", "AGE": "30"}) == []

    # Missing required field
    errors = validate_user_fields(metadata, {"AGE": "30"})
    assert any("CIN" in e and "required" in e for e in errors)

    # Pattern violation
    errors = validate_user_fields(metadata, {"CIN": "abc", "AGE": "30"})
    assert any("CIN" in e and "invalid format" in e for e in errors)

    # Number out of range / not a number
    errors = validate_user_fields(metadata, {"CIN": "12345678", "AGE": "-5"})
    assert any("AGE" in e and "below minimum" in e for e in errors)
    errors = validate_user_fields(metadata, {"CIN": "12345678", "AGE": "abc"})
    assert any("AGE" in e and "not a number" in e for e in errors)

    # Optional field left empty is fine
    assert validate_user_fields(metadata, {"CIN": "12345678", "AGE": "30", "NOTE": ""}) == []

    # Empty metadata -> no validation
    assert validate_user_fields({}, {}) == []


@pytest.mark.unit
async def test_generate_contract_rejects_invalid_fields(seeded_repo):
    """generate_contract validates user_fields against field_metadata server-side."""
    from app.services.template_service import set_template_repo

    tmpl = {
        **SAMPLE_TEMPLATE,
        "slug": "test-validation",
        "field_metadata": {
            "NOM_BAILLEUR": {"type": "text", "required": True},
            "CIN_BAILLEUR": {"type": "cin", "required": True, "pattern": r"^\d{8}$"},
        },
    }
    await seeded_repo.upsert(tmpl)
    set_template_repo(seeded_repo)

    # Missing required + invalid pattern
    result = await generate_contract(
        GenerateRequest(contract_slug="test-validation", language=Language.fr, user_fields={"CIN_BAILLEUR": "abc"})
    )
    assert result["success"] is False
    assert "Validation failed" in result["error"]
    assert "NOM_BAILLEUR" in result["error"]
    assert "CIN_BAILLEUR" in result["error"]

    # Valid fields pass and produce a contract
    result = await generate_contract(
        GenerateRequest(
            contract_slug="test-validation",
            language=Language.fr,
            user_fields={"NOM_BAILLEUR": "Ali Ben Salah", "CIN_BAILLEUR": "12345678"},
        )
    )
    assert result["success"] is True
    assert result["contract"] is not None
