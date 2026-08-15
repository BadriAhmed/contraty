"""
Clean step: flatten the raw per-page article dicts into one deduplicated,
sorted list per code ({coc,ct,cs}_clean.json).

The scraper (scraper.py) writes raw/{code}/{code}_articles.json as
{label: [article, ...]}. This flattens all pages, keeps the best version of
each article number (prefer modified, then longer text), drops empty/'.' text,
and writes the flat list consumed by the template builders.
"""

import json
import re
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parent / "raw"
CODES = ["coc", "ct", "cs"]


_LEAD_MARKERS = re.compile(r"^(?:\*\*\s*|-\s*|\u2022\s*|\u00b7\s*)+")


def _is_junk(text: str) -> bool:
    """True when the text has no meaningful content (markers/punctuation only)."""
    t = text.strip()
    if not t:
        return True
    cleaned = re.sub(r"#BeginEditable|#EndEditable|texte", "", t)
    cleaned = re.sub(r"[\s\.\-/\*\u2026«»\"'«»]+", "", cleaned)
    return cleaned == ""


def _strip(text: str) -> str:
    """Strip leading bullet/emphasis markers (e.g. '- ', '** ') and whitespace.

    Also normalizes non-breaking spaces (U+00A0) to regular spaces, matching
    the original clean step.
    """
    t = text.replace("\u00a0", " ").strip()
    return _LEAD_MARKERS.sub("", t).strip()


def clean(raw: dict) -> list[dict]:
    best: dict[int, dict] = {}
    for label, articles in raw.items():
        if not isinstance(articles, list):
            continue
        for a in articles:
            if not isinstance(a, dict) or "number" not in a:
                continue
            num = a["number"]
            text = _strip(a.get("text") or "")
            # drop empty / placeholder-only / editable-marker entries
            if _is_junk(text):
                continue

            entry = {
                "number": num,
                "text": text,
                "is_modified": bool(a.get("is_modified")),
                "references": a.get("references", []),
            }
            cur = best.get(num)
            if cur is None:
                best[num] = entry
            else:
                score_new = (entry["is_modified"], len(entry["text"]))
                score_cur = (cur["is_modified"], len(cur["text"]))
                if score_new > score_cur:
                    best[num] = entry

    return [v for _, v in sorted(best.items())]


if __name__ == "__main__":
    for code in CODES:
        raw_path = RAW_DIR / code / f"{code}_articles.json"
        out_path = RAW_DIR / f"{code}_clean.json"
        if not raw_path.exists():
            print(f"skip {code}: {raw_path} not found")
            continue
        raw = json.loads(raw_path.read_text(encoding="utf-8"))
        result = clean(raw)
        out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{code}: {len(result)} articles -> {out_path}")
