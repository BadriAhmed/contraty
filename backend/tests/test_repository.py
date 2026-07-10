"""Tests for repository layer (in-memory)."""

import pytest

from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository
from tests.conftest import SAMPLE_TEMPLATE, SAMPLE_TEMPLATE_2


@pytest.mark.unit
async def test_repo_list_empty():
    repo = InMemoryTemplateRepository()
    templates = await repo.list_all()
    assert templates == []


@pytest.mark.unit
async def test_repo_upsert_and_get(seeded_repo):
    t = await seeded_repo.get_by_slug("bail-habitation")
    assert t is not None
    assert t["slug"] == "bail-habitation"
    assert t["domain"] == "logement"
    assert t["field_count"] == 5


@pytest.mark.unit
async def test_repo_list_all(seeded_repo):
    templates = await seeded_repo.list_all()
    assert len(templates) == 2


@pytest.mark.unit
async def test_repo_list_by_domain(seeded_repo):
    templates = await seeded_repo.list_all(domain="logement")
    assert len(templates) == 1
    assert templates[0]["slug"] == "bail-habitation"


@pytest.mark.unit
async def test_repo_list_by_nonexistent_domain(seeded_repo):
    templates = await seeded_repo.list_all(domain="vehicules")
    assert templates == []


@pytest.mark.unit
async def test_repo_get_nonexistent(seeded_repo):
    t = await seeded_repo.get_by_slug("does-not-exist")
    assert t is None


@pytest.mark.unit
async def test_repo_delete(seeded_repo):
    result = await seeded_repo.delete("bail-habitation")
    assert result is True
    t = await seeded_repo.get_by_slug("bail-habitation")
    assert t is None


@pytest.mark.unit
async def test_repo_delete_nonexistent(seeded_repo):
    result = await seeded_repo.delete("nope")
    assert result is False


@pytest.mark.unit
async def test_repo_search_by_embedding_empty(seeded_repo):
    results = await seeded_repo.search_by_embedding([0.1] * 1536)
    assert results == []


@pytest.mark.unit
async def test_repo_upsert_overwrites(seeded_repo):
    modified = dict(SAMPLE_TEMPLATE)
    modified["title_fr"] = "Updated"
    await seeded_repo.upsert(modified)

    t = await seeded_repo.get_by_slug("bail-habitation")
    assert t["title_fr"] == "Updated"


@pytest.mark.unit
async def test_contract_repo_save_and_get(test_contract_repo):
    contract = {
        "template_slug": "bail-habitation",
        "language": "fr",
        "user_fields": {"NOM": "Ali"},
        "generated_json": {},
        "model_used": "mistral",
    }
    saved = await test_contract_repo.save(contract)
    assert saved["id"] is not None
    assert saved["template_slug"] == "bail-habitation"

    retrieved = await test_contract_repo.get_by_id(saved["id"])
    assert retrieved is not None
    assert retrieved["template_slug"] == "bail-habitation"


@pytest.mark.unit
async def test_contract_repo_list_by_user(test_contract_repo):
    for i in range(5):
        await test_contract_repo.save({
            "id": f"c-{i}",
            "user_id": "user-1",
            "template_slug": "bail-habitation",
            "language": "fr",
            "user_fields": {},
        })

    results = await test_contract_repo.list_by_user("user-1", limit=3)
    assert len(results) == 3


@pytest.mark.unit
async def test_contract_repo_delete(test_contract_repo):
    saved = await test_contract_repo.save({
        "template_slug": "bail-habitation",
        "language": "fr",
        "user_fields": {},
    })

    result = await test_contract_repo.delete(saved["id"])
    assert result is True
    retrieved = await test_contract_repo.get_by_id(saved["id"])
    assert retrieved is None


@pytest.mark.unit
async def test_repo_get_by_slug_not_modifying_original(seeded_repo):
    t = await seeded_repo.get_by_slug("bail-habitation")
    t["title_fr"] = "MUTATED"
    t2 = await seeded_repo.get_by_slug("bail-habitation")
    assert t2["title_fr"] != "MUTATED"
