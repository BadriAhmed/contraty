"""Tests for PDF generation endpoint."""

import pytest


@pytest.mark.unit
async def test_generate_pdf_success(client, filled_template):
    response = await client.post(
        "/api/v1/contracts/generate/pdf",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "contract_json": filled_template,
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"] == 'attachment; filename="bail-habitation-fr.pdf"'
    assert len(response.content) > 0
    assert response.content[:4] == b"%PDF"


@pytest.mark.unit
async def test_generate_pdf_arabic(client, filled_template):
    response = await client.post(
        "/api/v1/contracts/generate/pdf",
        json={
            "contract_slug": "bail-habitation",
            "language": "ar",
            "contract_json": filled_template,
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "bail-habitation-ar.pdf" in response.headers["content-disposition"]
    assert len(response.content) > 0
    assert response.content[:4] == b"%PDF"


@pytest.mark.unit
async def test_generate_pdf_invalid_contract_json(client):
    response = await client.post(
        "/api/v1/contracts/generate/pdf",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "contract_json": {"invalid": "data"},
        },
    )

    assert response.status_code == 400
    data = response.json()
    assert "Invalid contract JSON" in data["detail"]


@pytest.mark.unit
async def test_generate_pdf_malformed_json(client):
    response = await client.post(
        "/api/v1/contracts/generate/pdf",
        content=b"not json",
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 422


@pytest.mark.unit
async def test_generate_pdf_with_disclaimer(client, filled_template):
    response = await client.post(
        "/api/v1/contracts/generate/pdf",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "contract_json": filled_template,
        },
    )

    assert response.status_code == 200
    # PDF should be non-trivial (disclaimer + content)
    assert len(response.content) > 1000
