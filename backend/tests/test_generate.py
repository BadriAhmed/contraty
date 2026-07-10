"""Tests for contract generation endpoint."""

import pytest


@pytest.mark.unit
async def test_generate_success(client, mock_llm):
    mock_llm.return_value.success = True

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
    assert data["model_used"] == "test-model"
    assert data["fallback_attempted"] is False
    assert data["generation_time_ms"] >= 0


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
async def test_generate_fallback_attempted(client, mock_llm):
    mock_llm.return_value.success = True
    mock_llm.return_value.fallback_attempted = True
    mock_llm.return_value.model_used = "openai"

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
    assert data["fallback_attempted"] is True
    assert data["model_used"] == "openai"


@pytest.mark.unit
async def test_generate_llm_failure(client, mock_llm):
    mock_llm.return_value.success = False
    mock_llm.return_value.error = "LLM timeout"

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
    assert data["success"] is False
    assert data["contract"] is None
    assert data["error"] is not None
