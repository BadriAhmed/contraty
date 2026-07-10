"""Tests for the seed script."""

import pytest
from app.db.memory import InMemoryTemplateRepository
from app.db.seed import compute_complexity, deduplicate_fields, chunk_template


@pytest.mark.unit
def test_compute_complexity_low():
    assert compute_complexity(10) == "low"
    assert compute_complexity(12) == "low"
    assert compute_complexity(0) == "low"


@pytest.mark.unit
def test_compute_complexity_medium():
    assert compute_complexity(13) == "medium"
    assert compute_complexity(20) == "medium"


@pytest.mark.unit
def test_compute_complexity_high():
    assert compute_complexity(21) == "high"
    assert compute_complexity(100) == "high"


@pytest.mark.unit
def test_deduplicate_fields():
    sections = [
        {
            "articles": [
                {"fields": ["A", "B"]},
                {"fields": ["A", "C"]},
            ]
        },
        {
            "articles": [
                {"fields": ["B", "D"]},
            ]
        },
    ]
    assert deduplicate_fields(sections) == 4


@pytest.mark.unit
def test_deduplicate_fields_empty():
    assert deduplicate_fields([]) == 0
    assert deduplicate_fields(None) == 0


@pytest.mark.unit
def test_chunk_template():
    template = {
        "slug": "bail-habitation",
        "sections": [
            {
                "id": "sec-1",
                "articles": [
                    {"id": "art-a", "text_fr": "Article A", "text_ar": "المادة أ"},
                    {"id": "art-b", "text_fr": "Article B", "text_ar": "المادة ب"},
                ],
            },
            {
                "id": "sec-2",
                "articles": [
                    {"id": "art-c", "text_fr": "Article C", "text_ar": "المادة ج"},
                ],
            },
        ],
    }

    chunks = chunk_template(template)
    assert len(chunks) == 3

    assert chunks[0]["template_slug"] == "bail-habitation"
    assert chunks[0]["chunk_index"] == 0
    assert chunks[0]["section_id"] == "sec-1"
    assert chunks[0]["article_id"] == "art-a"
    assert chunks[0]["text_fr"] == "Article A"

    assert chunks[1]["chunk_index"] == 1
    assert chunks[2]["chunk_index"] == 2


@pytest.mark.unit
async def test_seed_into_repository():
    repo = InMemoryTemplateRepository()
    from app.db.seed import seed_templates

    # The seed reads from data/templates/ which should exist
    count = await seed_templates(repo)
    assert count >= 1

    templates = await repo.list_all()
    assert len(templates) == count
    for t in templates:
        assert "slug" in t
        assert "domain" in t
        assert "complexity" in t
        assert "field_count" in t
        assert t["field_count"] > 0
