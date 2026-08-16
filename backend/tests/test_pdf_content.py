"""Content-level validation of generated contracts.

These tests go beyond "%PDF" smoke checks: they assert that the deterministic
fill (the production path — the LLM only *reviews*, it does not fill) leaves no
[PLACEHOLDER] tokens behind and that the rendered PDF actually contains the
user's values and (for Arabic) real Arabic text.
"""

import io
import json
import re
from pathlib import Path

import pytest
from pypdf import PdfReader

from app.api.contracts import _find_data_dir
from app.models.contract import Contract, Language
from app.services.pdf import pdf_renderer
from app.services.template_service import _fill_template

PLACEHOLDER_RE = re.compile(r"\[[A-Z][A-Z0-9_]*[A-Z0-9]\]")
COND_RE = re.compile(r"\{\{[#/][A-Z0-9_]*\}\}")
ARABIC_RE = re.compile(r"[\u0600-\u06FF]")

_TEMPLATES_DIR = _find_data_dir(Path(__file__).resolve().parent) / "templates"


def _value_for(name: str, meta: dict, lang: str) -> str:
    t = meta.get("type") or "text"
    if t == "date":
        return "2025-06-15"
    if t in ("number", "percentage"):
        n = 1000
        if meta.get("min_value") is not None:
            n = max(n, int(meta["min_value"]))
        if meta.get("max_value") is not None:
            n = min(n, int(meta["max_value"]))
        return str(n)
    if t == "cin":
        return "12345678"
    if t == "phone":
        return "20123456"
    if t == "email":
        return "contact@example.com"
    if t == "select":
        opts = meta.get("options_ar" if lang == "ar" else "options_fr") or []
        return opts[0] if opts else ""
    base = f"Test {name.lower().replace('_', ' ')}"
    mn, mx = meta.get("min_length"), meta.get("max_length")
    if isinstance(mx, int) and len(base) > mx:
        base = base[:mx]
    if isinstance(mn, int) and len(base) < mn:
        base = base.ljust(mn, "x")
    return base


def _collect_fields(template: dict) -> list[str]:
    seen, out = set(), []
    for section in template.get("sections", []):
        for article in section.get("articles", []):
            for f in article.get("fields", []):
                if f not in seen:
                    seen.add(f)
                    out.append(f)
    return out


def _load_templates() -> list[dict]:
    return [json.loads(p.read_text()) for p in sorted(_TEMPLATES_DIR.glob("*.json"))]


def _filled_text(filled: dict, lang: str) -> str:
    key = "text_ar" if lang == "ar" else "text_fr"
    parts = []
    for s in filled["sections"]:
        for a in s["articles"]:
            if a.get(key):
                parts.append(a[key])
    return "\n".join(parts)


@pytest.mark.unit
@pytest.mark.parametrize("lang", ["fr", "ar"])
def test_all_templates_fill_without_placeholders(lang):
    """Every template, in both languages, fills cleanly (no tokens left)."""
    assert len(_load_templates()) == 22
    for tpl in _load_templates():
        meta = tpl.get("field_metadata", {})
        fields = _collect_fields(tpl)
        user_fields = {f: _value_for(f, meta.get(f, {}), lang) for f in fields}

        filled = _fill_template(Contract(**tpl), user_fields, Language(lang))
        text = _filled_text(filled, lang)

        assert not PLACEHOLDER_RE.search(text), f"{tpl['slug']} ({lang}) has leftover placeholders"
        assert not COND_RE.search(text), f"{tpl['slug']} ({lang}) has leftover conditional blocks"

        # The first field's value must have been substituted into the document.
        if fields:
            assert user_fields[fields[0]] in text, (
                f"{tpl['slug']} ({lang}) first value missing from text"
            )


@pytest.mark.slow
@pytest.mark.parametrize("lang", ["fr", "ar"])
def test_pdf_renders_filled_content_and_arabic(lang):
    """Render every template to PDF and verify extracted text.

    Marked slow: WeasyPrint renders 22 PDFs per language.
    """
    for tpl in _load_templates():
        slug = tpl["slug"]
        meta = tpl.get("field_metadata", {})
        fields = _collect_fields(tpl)
        user_fields = {f: _value_for(f, meta.get(f, {}), lang) for f in fields}

        filled = _fill_template(Contract(**tpl), user_fields, Language(lang))
        pdf_bytes = pdf_renderer.render_contract(Contract(**filled), Language(lang))
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = "\n".join((p.extract_text() or "") for p in reader.pages)

        assert text.strip(), f"{slug} ({lang}) PDF text is empty"
        assert not PLACEHOLDER_RE.search(text), f"{slug} ({lang}) PDF has placeholders"
        assert "....." not in text, f"{slug} ({lang}) PDF has blank-template dots"
        if lang == "ar":
            assert ARABIC_RE.search(text), f"{slug} (ar) PDF has no extractable Arabic"
        if fields:
            assert user_fields[fields[0]] in text, (
                f"{slug} ({lang}) first value missing from PDF"
            )
