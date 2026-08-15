"""Data-integrity tests for the 22 real templates in data/templates/*.json.

These guard the contract between the templates and the frontend wizard:
every placeholder rendered as an input must have metadata, CIN fields must
have a digit pattern, select fields must carry bilingual options, autocomplete
values must use the canonical kinds, and number fields must carry a range.
"""

import glob
import json
import os

import pytest

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "templates")

VALID_AUTOCOMPLETE = {
    "years",
    "vehicle-brand",
    "vehicle-model",
    "governorates",
    "cities",
    "places",
    "tribunals",
    "nationalities",
    "professions",
    "carburants",
}


def _load_all():
    paths = sorted(glob.glob(os.path.join(TEMPLATES_DIR, "*.json")))
    return [(os.path.basename(p), json.load(open(p, encoding="utf-8"))) for p in paths]


@pytest.mark.unit
def test_templates_directory_exists():
    assert os.path.isdir(TEMPLATES_DIR)


@pytest.mark.unit
def test_exactly_22_templates():
    assert len(_load_all()) == 22


@pytest.mark.unit
def test_every_referenced_field_has_metadata():
    for name, d in _load_all():
        metadata = d.get("field_metadata", {})
        seen = set()
        for section in d.get("sections", []):
            for article in section.get("articles", []):
                for field in article.get("fields", []):
                    seen.add(field)
        for field in seen:
            assert field in metadata, f"{name}: field {field!r} missing field_metadata"


@pytest.mark.unit
def test_cin_fields_have_digit_pattern():
    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            if meta.get("type") == "cin":
                assert meta.get("pattern"), f"{name}: CIN field {field!r} missing pattern"


@pytest.mark.unit
def test_select_fields_have_bilingual_options():
    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            if meta.get("type") == "select":
                assert meta.get("options_fr"), f"{name}: select {field!r} missing options_fr"
                assert meta.get("options_ar"), f"{name}: select {field!r} missing options_ar"


@pytest.mark.unit
def test_autocomplete_values_are_canonical():
    """No legacy aliases (tn-place/profession/tn-tribunal/nationality) remain."""
    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            ac = meta.get("autocomplete")
            if ac:
                assert ac in VALID_AUTOCOMPLETE, f"{name}: field {field!r} autocomplete {ac!r} not canonical"


@pytest.mark.unit
def test_date_field_patterns_accept_iso():
    """Date fields render <input type="date"> which submits ISO YYYY-MM-DD.

    A date field whose pattern rejects ISO (e.g. an 8-digit CIN pattern) would
    make the wizard show "Format invalide" on a valid date.
    """
    import re

    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            if meta.get("type") == "date" and meta.get("pattern"):
                assert re.search(meta["pattern"], "2026-08-15"), (
                    f"{name}: date field {field!r} pattern {meta['pattern']!r} rejects ISO dates"
                )


@pytest.mark.unit
def test_number_fields_have_ranges():
    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            if meta.get("type") in ("number", "percentage"):
                has_min = meta.get("min_value") is not None
                has_max = meta.get("max_value") is not None
                assert has_min or has_max, f"{name}: number field {field!r} has no min/max range"


@pytest.mark.unit
def test_number_fields_have_no_text_length_constraints():
    """min_length/max_length are text-only constraints.

    A min_length of 2 on a number field would reject single-digit values
    (e.g. DELAI_JOURS = "1") with "Texte trop court".
    """
    for name, d in _load_all():
        for field, meta in d.get("field_metadata", {}).items():
            if meta.get("type") in ("number", "percentage"):
                assert "min_length" not in meta and "max_length" not in meta, (
                    f"{name}: number field {field!r} has text length constraints"
                )
