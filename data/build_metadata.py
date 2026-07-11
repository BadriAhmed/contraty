#!/usr/bin/env python3
"""Auto-generate field_metadata for all contract templates.

Analyzes field names and assigns validation types:
  CIN / IDENTIFIANT  → cin      (8 digits)
  EMAIL / MAIL / COURRIEL → email
  TELEPHONE / TEL / GSM / PHONE → phone
  DATE → date
  MONTANT / PRIX / LOYER / CAUTION / CAPITAL / TAUX / POURCENTAGE / POURCENT → number
  DUREE / PREAVIS / DELAI → text with numeric hint

Fields labels are derived from the field name (humanized).
Placeholders are generated from the validation type.
"""

import json
import re
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "data" / "templates"

# Type detection rules: (pattern, field_type, example_placeholder_fr)
TYPE_RULES = [
    (r"CIN|IDENTIFIANT", "cin", "12345678"),
    (r"EMAIL|MAIL|COURRIEL", "email", "exemple@email.com"),
    (r"TELEPHONE|TEL(?!_)|PHONE|GSM", "phone", "+216 XX XXX XXX"),
    (r"DATE", "date", "JJ/MM/AAAA"),
    (r"MONTANT|PRIX|LOYER|CAUTION|CAPITAL|TAUX\b|TAUX_|POURCENT|POURCENTAGE|SALAIRE|HONORAIRE|MENSUEL|TARIF", "number", "0"),
    (r"DUREE|PREAVIS|DELAI|ECHEANCE", "text", "ex: 3 ans"),
    (r"ARTICLE|NUMERO|NUM_|N_", "text", "ex: Art. 1"),
    (r"TRIBUNAL|JURIDICTION|GOUVERNORAT|VILLE|REGION", "text", "ex: Tunis"),
    (r"IMMATRICULATION|CHASSIS|SERIE|MODELE|MARQUE|CYLINDREE|KM|ENERGIE|CARBURANT", "text", "ex: 123 Tun 1234"),
]

TYPE_HINTS = {
    "cin": {"ar": "8 أرقام", "fr": "8 chiffres"},
    "email": {"ar": "example@domaine.com", "fr": "exemple@domaine.com"},
    "phone": {"ar": "+216 XX XXX XXX", "fr": "+216 XX XXX XXX"},
    "date": {"ar": "يوم/شهر/سنة", "fr": "JJ/MM/AAAA"},
    "number": {"ar": "رقم", "fr": "Nombre"},
    "text": {"ar": "", "fr": ""},
    "percentage": {"ar": "0 — 100", "fr": "0 — 100"},
}

TYPE_PLACEHOLDERS = {
    "cin": {"ar": "12345678", "fr": "12345678"},
    "email": {"ar": "exemple@email.com", "fr": "exemple@email.com"},
    "phone": {"ar": "+216 XX XXX XXX", "fr": "+216 XX XXX XXX"},
    "date": {"ar": "يوم/شهر/سنة", "fr": "JJ/MM/AAAA"},
    "number": {"ar": "0", "fr": "0"},
    "percentage": {"ar": "%", "fr": "%"},
    "text": {"ar": "", "fr": ""},
}

TYPE_PATTERNS = {
    "cin": r"^\d{8}$",
    "email": r"^[^\s@]+@[^\s@]+\.[^\s@]+$",
    "phone": r"^(\+216)?\s?\d[\d\s]{6,10}$",
    "date": r"^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}$",
    "number": r"^-?\d+([\.\,]\d+)?$",
    "percentage": r"^\d{1,3}([\.\,]\d+)?$",
}


def detect_type(name: str) -> str:
    upper = name.upper().replace("[", "").replace("]", "")
    for pattern, ftype, _ in TYPE_RULES:
        if re.search(pattern, upper):
            return ftype
    return "text"


def humanize(name: str) -> tuple[str, str]:
    """Derive AR and FR labels from field name."""
    cleaned = name.replace("[", "").replace("]", "").replace("_", " ").strip()
    words = cleaned.lower().split()
    fr_label = " ".join(w.capitalize() if len(w) > 2 else w.upper() for w in words)

    # Simple Arabic mapping for common prefixes
    prefix_map = {
        "NOM": "الاسم",
        "PRENOM": "الاسم الشخصي",
        "CIN": "بطاقة التعريف",
        "ADRESSE": "العنوان",
        "EMAIL": "البريد الإلكتروني",
        "TELEPHONE": "الهاتف",
        "TEL": "الهاتف",
        "DATE": "تاريخ",
        "MONTANT": "المبلغ",
        "LOUER": "الكراء",
        "LOYER": "الكراء",
        "CAUTION": "التأمين",
        "PRIX": "الثمن",
        "DUREE": "المدة",
        "PREAVIS": "مهلة الإعلام",
        "TRIBUNAL": "المحكمة",
        "VILLE": "المدينة",
        "GOUVERNORAT": "الولاية",
        "LIEU": "المكان",
        "DESCRIPTION": "الوصف",
        "CAPITAL": "رأس المال",
        "SALAIRE": "الراتب",
        "MARQUE": "العلامة",
        "IMMATRICULATION": "الماتركل",
        "CHASSIS": "الشاصي",
        "NUMERO": "العدد",
        "TAUX": "النسبة",
    }

    first = words[0].upper().replace("[", "").replace("]", "") if words else cleaned.upper()
    ar_label = prefix_map.get(first, fr_label)

    if len(words) > 1 and first in prefix_map:
        suffix = " ".join(words[1:])
        ar_label = f"{ar_label} ({suffix})"

    return ar_label, fr_label


def build_metadata(field_name: str) -> dict:
    ftype = detect_type(field_name)
    ar_label, fr_label = humanize(field_name)
    placeholder_ar = TYPE_PLACEHOLDERS.get(ftype, {}).get("ar", "")
    placeholder_fr = TYPE_PLACEHOLDERS.get(ftype, {}).get("fr", "")
    hint_ar = TYPE_HINTS.get(ftype, {}).get("ar", "")
    hint_fr = TYPE_HINTS.get(ftype, {}).get("fr", "")
    pattern = TYPE_PATTERNS.get(ftype)

    meta = {
        "type": ftype,
        "label_ar": ar_label,
        "label_fr": fr_label,
        "placeholder_ar": placeholder_ar,
        "placeholder_fr": placeholder_fr,
        "required": True,
        "hint_ar": hint_ar,
        "hint_fr": hint_fr,
    }

    if pattern:
        meta["pattern"] = pattern

    if ftype in ("number", "percentage"):
        meta["min_value"] = 0
        if ftype == "percentage":
            meta["max_value"] = 100

    if ftype == "cin":
        meta["min_length"] = 8
        meta["max_length"] = 8

    if ftype == "text":
        meta["min_length"] = 2
        meta["max_length"] = 500

    return meta


def process_all():
    count = 0
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"SKIP {path.name}: {e}")
            continue

        seen = set()
        metadata = {}
        for section in data.get("sections", []):
            for article in section.get("articles", []):
                for field in article.get("fields", []):
                    if field not in seen:
                        seen.add(field)
                        metadata[field] = build_metadata(field)

        data["field_metadata"] = metadata
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"OK {path.name}: {len(metadata)} fields")
        count += 1

    print(f"\nProcessed {count} templates")


if __name__ == "__main__":
    process_all()
