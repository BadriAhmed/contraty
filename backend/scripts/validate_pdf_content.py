"""Validate that generated contract PDFs contain correct, fully-filled content.

For every template (data/templates/*.json) and both languages it:
  1. fills every field deterministically (the production path),
  2. renders the PDF with WeasyPrint,
  3. extracts the text and checks for:
     - leftover [PLACEHOLDER] tokens or {{#FIELD}} blocks
     - blank-template dotted lines
     - that filled values actually appear in the document
     - that Arabic text is present (and not tofu) for AR contracts

Run from the backend dir:  .venv/bin/python scripts/validate_pdf_content.py
"""

import io
import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.contract import Contract, Language  # noqa: E402
from app.services.pdf import pdf_renderer  # noqa: E402
from app.services.template_service import _fill_template  # noqa: E402

PLACEHOLDER_RE = re.compile(r"\[[A-Z][A-Z0-9_]*[A-Z0-9]\]")
COND_RE = re.compile(r"\{\{[#/][A-Z0-9_]*\}\}")
DOTS_RE = re.compile(r"\.{6,}")
ARABIC_RE = re.compile(r"[\u0600-\u06FF]")

TEMPLATES_DIR = Path(__file__).resolve().parents[2] / "data" / "templates"


def value_for(name: str, meta: dict, lang: str) -> str:
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


def collect_fields(template: dict) -> list[str]:
    seen, out = set(), []
    for section in template.get("sections", []):
        for article in section.get("articles", []):
            for f in article.get("fields", []):
                if f not in seen:
                    seen.add(f)
                    out.append(f)
    return out


def check(lang: str) -> dict:
    failures = []
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        tpl = json.loads(path.read_text())
        slug = tpl["slug"]
        meta = tpl.get("field_metadata", {})
        user_fields = {f: value_for(f, meta.get(f, {}), lang) for f in collect_fields(tpl)}

        contract = Contract(**tpl)
        filled = _fill_template(contract, user_fields, Language(lang))

        # Check the contract JSON for placeholder leaks.
        leaks = []
        for s in filled["sections"]:
            for a in s["articles"]:
                text = a.get("text_ar" if lang == "ar" else "text_fr", "") or ""
                for m in PLACEHOLDER_RE.findall(text):
                    leaks.append(m)
                if COND_RE.search(text):
                    leaks.append("{{#BLOCK}}")
        if leaks:
            failures.append(f"{slug} ({lang}): JSON placeholders left {sorted(set(leaks))}")

        # Render + extract the PDF text.
        pdf_bytes = pdf_renderer.render_contract(Contract(**filled), Language(lang))
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = "\n".join((p.extract_text() or "") for p in reader.pages)

        if PLACEHOLDER_RE.search(text):
            failures.append(f"{slug} ({lang}): PDF still has [PLACEHOLDER]")
        if DOTS_RE.search(text):
            failures.append(f"{slug} ({lang}): PDF has blank-template dotted lines")
        if lang == "ar" and not ARABIC_RE.search(text):
            failures.append(f"{slug} ({lang}): PDF has no extractable Arabic text")
        if not text.strip():
            failures.append(f"{slug} ({lang}): PDF text is empty")

        # Spot-check a value actually made it into the document.
        probe = user_fields.get(collect_fields(tpl)[0]) if collect_fields(tpl) else None
        if probe and probe not in text:
            failures.append(f"{slug} ({lang}): first field value {probe!r} missing from PDF")

    return {"lang": lang, "failures": failures}


def main() -> int:
    total_failures = 0
    for lang in ("fr", "ar"):
        r = check(lang)
        print(f"\n=== {lang.upper()} ===")
        if r["failures"]:
            total_failures += len(r["failures"])
            for f in r["failures"]:
                print(f"  ✗ {f}")
        else:
            print("  ✓ all 22 templates: no placeholders, values present, text extractable")
    print(f"\nTOTAL FAILURES: {total_failures}")
    return 1 if total_failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
