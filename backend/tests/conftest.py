"""
Test fixtures for Contraty backend.

Provides:
- test_template_repo: In-memory template repository pre-seeded with sample data
- test_contract_repo: In-memory contract repository
- client: HTTPX AsyncClient for FastAPI TestClient
- mock_llm: Patches LLMRouter.generate to return controlled responses
"""

import json
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, patch

from httpx import ASGITransport, AsyncClient

from app.db.memory import InMemoryTemplateRepository, InMemoryContractRepository


SAMPLE_TEMPLATE = {
    "id": "bail-habitation-v1",
    "slug": "bail-habitation",
    "title_ar": "عقد كراء مسكن",
    "title_fr": "Contrat de Bail d'Habitation",
    "domain": "logement",
    "legal_basis": "Code des Obligations et des Contrats, articles 727 à 827",
    "version": "1.0",
    "reviewed_by": None,
    "review_date": None,
    "source": "public_examples",
    "disclaimer": "Modèle indicatif — non révisé par un avocat.",
    "sections": [
        {
            "id": "sec-parties",
            "title_ar": "الأطراف",
            "title_fr": "Parties",
            "articles": [
                {
                    "id": "art-bailleur",
                    "text_ar": "السيد/ة [NOM_BAILLEUR]، تونسي/ة الجنسية...",
                    "text_fr": "M./Mme [NOM_BAILLEUR], de nationalité tunisienne...",
                    "fields": ["NOM_BAILLEUR", "CIN_BAILLEUR"],
                },
                {
                    "id": "art-preneur",
                    "text_ar": "السيد/ة [NOM_PRENEUR]...",
                    "text_fr": "M./Mme [NOM_PRENEUR]...",
                    "fields": ["NOM_PRENEUR", "CIN_PRENEUR"],
                },
            ],
        },
        {
            "id": "sec-objet",
            "title_ar": "موضوع العقد",
            "title_fr": "Objet du contrat",
            "articles": [
                {
                    "id": "art-objet",
                    "text_ar": "يمنح المكري للمكتري العقار الكائن بـ [ADRESSE_BIEN].",
                    "text_fr": "Le Bailleur donne à bail le bien situé à [ADRESSE_BIEN].",
                    "fields": ["ADRESSE_BIEN"],
                }
            ],
        },
    ],
    "complexity": "medium",
    "field_count": 5,
}

SAMPLE_TEMPLATE_2 = {
    "id": "contrat-cdi-v1",
    "slug": "contrat-cdi",
    "title_ar": "عقد عمل غير محدد المدة",
    "title_fr": "Contrat de Travail à Durée Indéterminée",
    "domain": "travail",
    "legal_basis": "Code du Travail, articles 6 à 52",
    "version": "1.0",
    "reviewed_by": None,
    "review_date": None,
    "source": "public_examples",
    "disclaimer": "Modèle indicatif — non révisé par un avocat.",
    "sections": [
        {
            "id": "sec-parties",
            "title_ar": "الأطراف",
            "title_fr": "Parties",
            "articles": [
                {
                    "id": "art-employeur",
                    "text_ar": "شركة [NOM_EMPLOYEUR]...",
                    "text_fr": "La société [NOM_EMPLOYEUR]...",
                    "fields": ["NOM_EMPLOYEUR"],
                }
            ],
        }
    ],
    "complexity": "medium",
    "field_count": 1,
}


@pytest.fixture(autouse=True)
def _reset_rate_limits():
    """Reset rate limiter storage before each test to avoid 429 responses in test suites."""
    from app.core.limiter import limiter
    limiter._storage.reset()
    yield


@pytest.fixture
def test_template_repo():
    """In-memory template repository with 2 sample templates."""
    repo = InMemoryTemplateRepository()
    return repo


@pytest.fixture
async def seeded_repo(test_template_repo):
    """Template repository pre-seeded with sample data."""
    await test_template_repo.upsert(SAMPLE_TEMPLATE)
    await test_template_repo.upsert(SAMPLE_TEMPLATE_2)
    return test_template_repo


@pytest.fixture
def test_contract_repo():
    """In-memory contract repository."""
    return InMemoryContractRepository()


@pytest.fixture
def mock_llm():
    """Patch LLMRouter.generate to return a controlled response.

    The mock reflects the input language. Tests can override behavior
    by setting attributes on mock_llm.return_value before the API call:
        mock_llm.return_value.success = False
        mock_llm.return_value.error = "LLM timeout"
        mock_llm.return_value.contract = None

    The mock adjusts .language on each call to match the requested language.
    """
    from app.models.contract import Contract, ContractResponse, Language

    default_state = {
        "success": True,
        "model": "test-model",
        "error": None,
        "fallback": False,
    }

    class DynamicResponse:
        success = True
        model_used = "test-model"
        language = Language.fr
        error = None
        fallback_attempted = False
        contract = Contract(**SAMPLE_TEMPLATE)

    dyn = DynamicResponse()

    async def _dynamic_response(prompt, language, max_attempts=3):
        contract = dyn.contract
        if dyn.success and contract is not None:
            try:
                contract = Contract(**contract.model_dump() if hasattr(contract, 'model_dump') else contract.__dict__)
            except Exception:
                contract = Contract(**SAMPLE_TEMPLATE)
        else:
            contract = None

        resp = ContractResponse(
            success=dyn.success,
            contract=contract,
            model_used=dyn.model_used,
            language=language if language else Language.fr,
            error=dyn.error,
            fallback_attempted=dyn.fallback_attempted,
        )
        dyn.language = resp.language
        return resp

    with patch("app.services.llm.LLMRouter.generate", new_callable=AsyncMock) as mock:
        mock.side_effect = _dynamic_response
        mock.return_value = dyn
        yield mock


@pytest.fixture
def client(seeded_repo):
    """FastAPI TestClient with seeded in-memory repository."""
    from app.main import app
    from app.services.template_service import set_template_repo, set_contract_repo
    from app.db.memory import InMemoryContractRepository

    set_template_repo(seeded_repo)
    set_contract_repo(InMemoryContractRepository())

    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.fixture
def filled_template():
    """A template with all placeholders filled — as returned by successful generation."""
    return {
        "id": "bail-habitation-v1",
        "slug": "bail-habitation",
        "title_ar": "عقد كراء مسكن",
        "title_fr": "Contrat de Bail d'Habitation",
        "language": ["fr", "ar"],
        "domain": "logement",
        "legal_basis": "Code des Obligations et des Contrats, articles 727 à 827",
        "version": "1.0",
        "reviewed_by": None,
        "review_date": None,
        "source": "public_examples",
        "disclaimer": "Modèle indicatif — non révisé par un avocat.",
        "sections": [
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    {
                        "id": "art-bailleur",
                        "text_ar": "السيد Ali Ben Salah، تونسي الجنسية...",
                        "text_fr": "M. Ali Ben Salah, de nationalité tunisienne...",
                        "fields": [],
                    },
                ],
            },
        ],
    }
