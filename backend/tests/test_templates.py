"""Tests for template listing and detail endpoints."""

import pytest


@pytest.mark.unit
async def test_list_all_templates(client):
    response = await client.get("/api/v1/contracts/templates")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert all("slug" in t for t in data)
    assert all("title_ar" in t for t in data)
    assert all("title_fr" in t for t in data)
    assert all("domain" in t for t in data)
    assert all("field_count" in t for t in data)


@pytest.mark.unit
async def test_list_templates_by_domain(client):
    response = await client.get("/api/v1/contracts/templates?domain=logement")
    assert response.status_code == 200
    data = response.json()
    assert all(t["domain"] == "logement" for t in data)


@pytest.mark.unit
async def test_list_templates_by_domain_no_results(client):
    response = await client.get("/api/v1/contracts/templates?domain=vehicules")
    assert response.status_code == 200
    data = response.json()
    assert data == []


@pytest.mark.unit
async def test_get_template_by_slug(client):
    response = await client.get("/api/v1/contracts/templates/bail-habitation")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "bail-habitation"
    assert data["domain"] == "logement"
    assert data["field_count"] == 5
    assert "sections" in data
    assert len(data["sections"]) >= 1
    # First section has articles with fields
    assert "articles" in data["sections"][0]
    assert len(data["sections"][0]["articles"]) >= 1
    assert "fields" in data["sections"][0]["articles"][0]
    assert isinstance(data["sections"][0]["articles"][0]["fields"], list)


@pytest.mark.unit
async def test_get_template_not_found(client):
    response = await client.get("/api/v1/contracts/templates/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Template not found"


@pytest.mark.unit
async def test_list_templates_returns_summary_fields(client):
    response = await client.get("/api/v1/contracts/templates")
    data = response.json()
    for t in data:
        assert set(t.keys()).issuperset({"slug", "title_ar", "title_fr", "domain", "complexity", "field_count"})


@pytest.mark.unit
async def test_list_templates_with_language_param(client):
    response = await client.get("/api/v1/contracts/templates?language=fr")
    assert response.status_code == 200


@pytest.mark.unit
async def test_template_detail_has_valid_complexity(client):
    response = await client.get("/api/v1/contracts/templates/bail-habitation")
    data = response.json()
    assert data["complexity"] in ("low", "medium", "high")


@pytest.mark.unit
async def test_template_detail_has_wizard_fields(client):
    """FE wizard needs sections with articles and deduplicated field list."""
    response = await client.get("/api/v1/contracts/templates/bail-habitation")
    data = response.json()

    # Collect all unique field names across all articles
    seen = set()
    for section in data["sections"]:
        assert "id" in section
        assert "title_ar" in section
        assert "title_fr" in section
        for article in section.get("articles", []):
            assert "id" in article
            assert "text_ar" in article
            assert "text_fr" in article
            assert "fields" in article
            for field in article["fields"]:
                seen.add(field)

    # Deduplicated count should match field_count
    assert len(seen) == data["field_count"]
