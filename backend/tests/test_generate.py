"""Tests for contract generation endpoint."""

from pathlib import Path

import pytest

from app.api.contracts import _find_data_dir


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


@pytest.mark.unit
async def test_vehicles_endpoint(client):
    """Vehicle catalog endpoint returns brand + model names."""
    resp = await client.get("/api/v1/contracts/vehicles")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list) and len(data) > 40
    audi = next(b for b in data if b["brand"].lower() == "audi")
    assert len(audi["models"]) > 3


@pytest.mark.unit
async def test_reference_endpoints(client):
    """Reference lists (places, tribunals, nationalities) are served bilingually."""
    for kind, min_len in [("places", 100), ("tribunals", 20), ("nationalities", 30), ("carburants", 4)]:
        resp = await client.get(f"/api/v1/contracts/reference/{kind}")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data.get("fr", [])) >= min_len
        assert len(data.get("ar", [])) >= min_len
    resp = await client.get("/api/v1/contracts/reference/nope")
    assert resp.status_code == 404


@pytest.mark.unit
def test_find_data_dir_repo_layout():
    """_find_data_dir locates data/ when walking up from the source tree."""
    api_dir = Path(__file__).resolve().parents[2] / "app" / "api"  # backend/app/api
    data_dir = _find_data_dir(api_dir)
    assert data_dir.is_dir()
    assert (data_dir / "reference").is_dir()
    assert (data_dir / "vehicles" / "tn_cars.json").is_file()


@pytest.mark.unit
def test_find_data_dir_docker_layout(tmp_path):
    """Regression: data/ must be found in the Cloud Run image layout too.

    In the image, contracts.py sits at /app/app/api/ while data/ is at /app,
    so a fixed parents[3] lookup resolved to the filesystem root and the
    reference/vehicle endpoints silently returned empty lists in production.
    """
    image_app = tmp_path / "app" / "app" / "api"
    image_app.mkdir(parents=True)
    (tmp_path / "app" / "data" / "reference").mkdir(parents=True)
    (tmp_path / "app" / "data" / "vehicles").mkdir(parents=True)
    (tmp_path / "app" / "data" / "vehicles" / "tn_cars.json").write_text("[]")

    data_dir = _find_data_dir(image_app)
    assert data_dir == (tmp_path / "app" / "data")
    assert (data_dir / "reference").is_dir()
    assert (data_dir / "vehicles" / "tn_cars.json").is_file()
