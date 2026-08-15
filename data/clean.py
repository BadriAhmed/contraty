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


def _is_junk(text: str) -> bool:
    """True when the text has no meaningful content (markers/punctuation only)."""
    t = text.strip()
    if not t:
        return True
    cleaned = re.sub(r"#BeginEditable|#EndEditable|texte", "", t)
    cleaned = re.sub(r"[\s\.\-/\*\u2026«»\"'«»]+", "", cleaned)
    return cleaned == ""


def clean(raw: dict) -> list[dict]:
    best: dict[int, dict] = {}
    for label, articles in raw.items():
        if not isinstance(articles, list):
            continue
        for a in articles:
            if not isinstance(a, dict) or "number" not in a:
                continue
            num = a["number"]
            text = (a.get("text") or "").strip()
            # drop empty / placeholder-only / editable-marker entries
            if _is_junk(text):
                continue

            cur = best.get(num)
            score_new = (bool(a.get("is_modified")), len(text))
            if cur is None:
                best[num] = a
            else:
                score_cur = (bool(cur.get("is_modified")), len(cur.get("text") or ""))
                if score_new > score_cur:
                    best[num] = a

    return [
        {
            "number": num,
            "text": v.get("text", "").strip(),
            "is_modified": bool(v.get("is_modified")),
            "references": v.get("references", []),
        }
        for num, v in sorted(best.items())
    ]


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
