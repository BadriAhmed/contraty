"""Tests for health endpoint and app lifecycle."""

import pytest


@pytest.mark.unit
async def test_health_returns_ok(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["templates_loaded"] >= 1


@pytest.mark.unit
async def test_health_with_empty_db(test_template_repo):
    """Even with an empty repo, auto-seed fills it at startup."""
    from app.main import app
    from app.services.template_service import set_template_repo, set_contract_repo
    from app.db.memory import InMemoryContractRepository
    from httpx import ASGITransport, AsyncClient

    set_template_repo(test_template_repo)
    set_contract_repo(InMemoryContractRepository())

    transport = ASGITransport(app=app)
    c = AsyncClient(transport=transport, base_url="http://test")

    # Lifespan auto-seeds the empty repo, so templates should be loaded
    response = await c.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    # After auto-seed, the repo has templates
    assert data["templates_loaded"] >= 1


@pytest.mark.unit
async def test_health_returns_json_content_type(client):
    response = await client.get("/health")
    assert "application/json" in response.headers["content-type"]
