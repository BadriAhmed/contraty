"""Tests for contract generation endpoint."""

import pytest


@pytest.mark.unit
async def test_generate_success(client):
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "user_fields": {
                "NOM_BAILLEUR": "Ali Ben Salah",
                "CIN_BAILLEUR": "12345678",
                "NOM_PRENEUR": "Fatma Trabelsi",
            },
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["contract"] is not None
    assert data["model_used"] == "template-engine"
    assert data["fallback_attempted"] is False
    assert data["generation_time_ms"] >= 0
    assert data["error"] is None


@pytest.mark.unit
async def test_generate_template_not_found(client, mock_llm):
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "does-not-exist",
            "language": "fr",
            "user_fields": {"NOM": "Ali"},
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["contract"] is None
    assert "not found" in data["error"].lower()


@pytest.mark.unit
async def test_generate_missing_fields(client):
    response = await client.post(
        "/api/v1/contracts/generate",
        json={"language": "fr", "user_fields": {}},
    )
    assert response.status_code == 422


@pytest.mark.unit
async def test_generate_empty_user_fields(client):
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "user_fields": {},
        },
    )
    assert response.status_code == 400
    data = response.json()
    assert "user_fields" in data["detail"].lower()


@pytest.mark.unit
async def test_generate_missing_slug(client):
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "",
            "language": "fr",
            "user_fields": {"NOM": "Ali"},
        },
    )
    assert response.status_code == 400


@pytest.mark.unit
async def test_generate_arabic(client, mock_llm):
    mock_llm.return_value.success = True

    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "bail-habitation",
            "language": "ar",
            "user_fields": {"NOM_BAILLEUR": "علي بن صالح"},
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["language"] == "ar"


@pytest.mark.unit
async def test_generate_no_fallback_needed(client):
    """Template engine always succeeds — no fallback needed."""
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "user_fields": {"NOM_BAILLEUR": "Ali"},
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["fallback_attempted"] is False
    assert data["model_used"] == "template-engine"


@pytest.mark.unit
async def test_generate_placeholder_substitution(client):
    """Verify placeholders are actually replaced with user values."""
    response = await client.post(
        "/api/v1/contracts/generate",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "user_fields": {"NOM_BAILLEUR": "Ali Ben Salah"},
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    contract = data["contract"]
    # Check that placeholder was replaced
    first_article = contract["sections"][0]["articles"][0]
    assert "Ali Ben Salah" in first_article["text_fr"]
    assert "[NOM_BAILLEUR]" not in first_article["text_fr"]
    # Check that fields array was cleared
    assert first_article["fields"] == []
