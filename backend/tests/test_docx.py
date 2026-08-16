"""Tests for the DOCX generation endpoint."""

import pytest


@pytest.mark.unit
async def test_generate_docx_success(client, filled_template):
    response = await client.post(
        "/api/v1/contracts/generate/docx",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "contract_json": filled_template,
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "bail-habitation-fr.docx" in response.headers["content-disposition"]
    assert len(response.content) > 0
    # OOXML is a ZIP archive — magic bytes "PK".
    assert response.content[:2] == b"PK"


@pytest.mark.unit
async def test_generate_docx_arabic(client, filled_template):
    response = await client.post(
        "/api/v1/contracts/generate/docx",
        json={
            "contract_slug": "bail-habitation",
            "language": "ar",
            "contract_json": filled_template,
        },
    )

    assert response.status_code == 200
    assert "bail-habitation-ar.docx" in response.headers["content-disposition"]
    assert response.content[:2] == b"PK"


@pytest.mark.unit
async def test_generate_docx_invalid_contract_json(client):
    response = await client.post(
        "/api/v1/contracts/generate/docx",
        json={
            "contract_slug": "bail-habitation",
            "language": "fr",
            "contract_json": {"invalid": "data"},
        },
    )

    assert response.status_code == 400
    assert "Invalid contract JSON" in response.json()["detail"]
