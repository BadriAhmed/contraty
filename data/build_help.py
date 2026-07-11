#!/usr/bin/env python3
"""Generate contextual help_ar/help_fr for all fields, using section context.

Unlike the pattern-based approach, this understands WHO each field belongs to
(bailleur vs preneur, employeur vs salarié, créancier vs débiteur, etc.)
based on the section the field appears in.
"""

import json
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "data" / "templates"

# Section title → (role_fr, role_ar) — maps section context to party labels
ROLE_MAP = {
    # Bail
    "Parties": ("de la partie concernée", "للطرف المعني"),
    "الأطراف": ("de la partie concernée", "للطرف المعني"),
    "Objet du contrat": ("du contrat", "في العقد"),
    "موضوع العقد": ("du contrat", "في العقد"),
    "Objet de la vente": ("du véhicule vendu", "للعربة المباعة"),
    "موضوع البيع": ("du véhicule vendu", "للعربة المباعة"),
    "Prix de vente": ("de la transaction", "لعملية البيع"),
    "ثمن البيع": ("de la transaction", "لعملية البيع"),
    "Durée": ("du contrat", "للعقد"),
    "المدة": ("du contrat", "للعقد"),
    "Paiement": ("pour cette période de location", "عن فترة الكراء"),
    "الدفع": ("pour cette période de location", "عن فترة الكراء"),
    "Loyer et charges": ("pour le paiement du loyer", "لدفع معين الكراء"),
    "معين الكراء والمصاريف": ("pour le paiement du loyer", "لدفع معين الكراء"),
    "Caution": ("pour le dépôt de garantie", "للتأمين الكرائي"),
    "التأمين": ("pour le dépôt de garantie", "للتأمين الكرائي"),
    "Obligations": ("selon les obligations légales", "حسب الالتزامات القانونية"),
    "الالتزامات": ("selon les obligations légales", "حسب الالتزامات القانونية"),
    "Décharge": ("de cette décharge", "لهذا الإبراء"),
    "الإبراء": ("de cette décharge", "لهذا الإبراء"),
    "Résiliation": ("en cas de résiliation", "عند فسخ العقد"),
    "فسخ العقد": ("en cas de résiliation", "عند فسخ العقد"),
    "Litiges": ("en cas de litige", "في حالة النزاع"),
    "النزاعات": ("en cas de litige", "في حالة النزاع"),
    "Signature": ("pour la signature", "للتوقيع"),
    "التوقيع": ("pour la signature", "للتوقيع"),
    "Engagement au travail": ("du poste et des conditions de travail", "للمنصب وظروف العمل"),
    "الالتزام بالعمل": ("du poste et des conditions de travail", "للمنصب وظروف العمل"),
    "Rémunération": ("du salaire et des avantages", "للأجر والامتيازات"),
    "الأجر": ("du salaire et des avantages", "للأجر والامتيازات"),
    "Rupture": ("en cas de fin de contrat", "عند إنهاء العقد"),
    "إنهاء العقد": ("en cas de fin de contrat", "عند إنهاء العقد"),
    "Durée du travail": ("des horaires et congés", "لأوقات العمل والراحة"),
    "مدة العمل": ("des horaires et congés", "لأوقات العمل والراحة"),
    "Période d'essai": ("pour la période d'essai", "لفترة التجربة"),
    "فترة التجربة": ("pour la période d'essai", "لفترة التجربة"),
    "Confidentialité": ("relatif à la confidentialité", "متعلق بالسرية"),
    "السرية": ("relatif à la confidentialité", "متعلق بالسرية"),
    "Capital social": ("de la société", "للشركة"),
    "رأس المال": ("de la société", "للشركة"),
    "Gérance": ("du gérant de la société", "لمسير الشركة"),
    "التسيير": ("du gérant de la société", "لمسير الشركة"),
    "Véhicule": ("du véhicule concerné", "للعربة المعنية"),
    "العربة": ("du véhicule concerné", "للعربة المعنية"),
    "Garanties": ("des garanties du contrat", "لضمانات العقد"),
    "الضمانات": ("des garanties du contrat", "لضمانات العقد"),
    "Prêt": ("du prêt entre particuliers", "للقرض بين الخواص"),
    "القرض": ("du prêt entre particuliers", "للقرض بين الخواص"),
}

# Field keyword → (help_fr, help_ar) — disambiguates by field name
FIELD_HINTS = {
    "NOM_BAILLEUR": ("Nom complet du propriétaire qui met le bien en location.", "الاسم الكامل للمكري صاحب العقار الذي يؤجره."),
    "CIN_BAILLEUR": ("Numéro à 8 chiffres de la CIN du propriétaire (celui qui loue).", "رقم بطاقة التعريف الوطنية للمكري (صاحب الدار)."),
    "ADRESSE_BAILLEUR": ("Adresse personnelle du propriétaire (celui qui loue le bien).", "العنوان الشخصي للمكري صاحب العقار."),
    "NOM_PRENEUR": ("Nom complet du locataire qui occupera le logement.", "الاسم الكامل للمكتري الذي سيسكن في الدار."),
    "CIN_PRENEUR": ("Numéro à 8 chiffres de la CIN du locataire (celui qui habitera le bien).", "رقم بطاقة التعريف الوطنية للمكتري (الساكن)."),
    "ADRESSE_PRENEUR": ("Adresse actuelle du locataire avant d'emménager.", "العنوان الحالي للمكتري قبل الانتقال للسكن."),
    "ADRESSE_BIEN": ("Adresse complète du logement concerné par ce contrat.", "العنوان الكامل للمسكن موضوع عقد الكراء."),
    "DESCRIPTION_BIEN": ("Description du logement (nombre de pièces, étage, équipements).", "وصف المسكن (عدد الغرف، الطابق، التجهيزات)."),
    "DUREE_BAIL": ("Durée de la location (ex: 1 an, 3 ans renouvelable).", "مدة الكراء (مثال: سنة، 3 سنوات قابلة للتجديد)."),
    "NOM_ENTREPRISE": ("Nom officiel de l'entreprise tel qu'enregistré au RNE.", "الاسم الرسمي للشركة كما هو مسجل بالسجل الوطني للمؤسسات."),
    "NOM_SALARIE": ("Nom complet de l'employé qui sera recruté.", "الاسم الكامل للأجير الذي سيتم انتدابه."),
    "CIN_SALARIE": ("Numéro à 8 chiffres de la CIN de l'employé.", "رقم بطاقة التعريف الوطنية للأجير."),
    "ADRESSE_SALARIE": ("Adresse personnelle de l'employé recruté.", "العنوان الشخصي للأجير الذي تم انتدابه."),
    "NOM_CREANCIER": ("Nom complet de la personne à qui l'argent est dû (le créancier).", "الاسم الكامل للشخص الذي يستحق المال (الدائن)."),
    "NOM_DEBITEUR": ("Nom complet de la personne qui doit rembourser la dette (le débiteur).", "الاسم الكامل للشخص الذي عليه الدين (المدين)."),
    "NOM_VENDEUR": ("Nom complet du vendeur du véhicule.", "الاسم الكامل للبائع صاحب العربة."),
    "NOM_ACHETEUR": ("Nom complet de l'acheteur du véhicule.", "الاسم الكامل للمشتري الذي سيصبح مالك العربة."),
    "NOM_HEBERGEANT": ("Nom complet de la personne qui héberge (celle qui déclare loger quelqu'un chez elle).", "الاسم الكامل للشخص المستضيف (الذي يأوي شخصًا آخر في منزله)."),
    "NOM_HEBERGE": ("Nom complet de la personne hébergée (celle qui est logée chez l'hébergeant).", "الاسم الكامل للشخص المستضاف (الذي يسكن عند المستضيف)."),
    "CIN_HEBERGEANT": ("Numéro CIN de la personne qui héberge (le propriétaire du logement).", "رقم بطاقة تعريف الشخص المستضيف (صاحب المسكن)."),
    "CIN_HEBERGE": ("Numéro CIN de la personne hébergée (celle qui est logée).", "رقم بطاقة تعريف الشخص المستضاف (الساكن)."),
    "ADRESSE_HEBERGEANT": ("Adresse du domicile de la personne qui héberge.", "عنوان منزل الشخص المستضيف."),
    "ADRESSE_HEBERGEMENT": ("Adresse du logement où la personne est hébergée.", "عنوان المسكن الذي يقيم فيه الشخص المستضاف."),
}


def generate_help(name: str, label_fr: str, label_ar: str, section_fr: str, section_ar: str) -> tuple[str, str]:
    """Generate contextual help text using section + field name context."""

    # Use explicit hints for ambiguous fields first
    if name in FIELD_HINTS:
        return FIELD_HINTS[name]

    # Determine role from section
    role_fr = ROLE_MAP.get(section_fr, ("", ""))[0]
    role_ar = ROLE_MAP.get(section_ar, ("", ""))[1]
    if not role_ar:
        role_ar = ROLE_MAP.get(section_fr, ("", ""))[1]

    # Determine field type for context
    upper = name.upper().replace("[", "").replace("]", "")
    ftype = _detect_type(upper)

    if ftype == "cin":
        return (
            f"Numéro à 8 chiffres de la carte d'identité nationale {role_fr}.".strip(),
            f"رقم بطاقة التعريف الوطنية المكون من 8 أرقام {role_ar}.".strip(),
        )
    elif ftype == "name":
        return (
            f"Nom complet (prénom et nom de famille) {role_fr}.".strip(),
            f"الاسم الكامل (الاسم واللقب) {role_ar}.".strip(),
        )
    elif ftype == "address":
        return (
            f"Adresse complète (rue, numéro, ville) {role_fr}.".strip(),
            f"العنوان الكامل (النهج، الرقم، المدينة) {role_ar}.".strip(),
        )
    elif ftype == "date":
        return (
            f"Date au format JJ/MM/AAAA {role_fr}.".strip(),
            f"التاريخ بصيغة يوم/شهر/سنة {role_ar}.".strip(),
        )
    elif ftype == "amount":
        return (
            f"Montant en dinars tunisiens {role_fr}.".strip(),
            f"المبلغ بالدينار التونسي {role_ar}.".strip(),
        )
    elif ftype == "duration":
        return (
            f"Durée en années ou mois {role_fr}.".strip(),
            f"المدة بالسنوات أو الأشهر {role_ar}.".strip(),
        )
    elif ftype == "email":
        return (
            f"Adresse email valide {role_fr} pour les communications.".strip(),
            f"عنوان البريد الإلكتروني {role_ar} للمراسلات.".strip(),
        )
    elif ftype == "phone":
        return (
            f"Numéro de téléphone tunisien (8 chiffres) {role_fr}.".strip(),
            f"رقم الهاتف التونسي (8 أرقام) {role_ar}.".strip(),
        )
    else:
        # Generic with role context
        return (
            f"Veuillez renseigner {label_fr.lower()} {role_fr}.".strip(),
            f"يرجى إدخال {label_ar} {role_ar}.".strip(),
        )


def _detect_type(name: str) -> str:
    upper = name.upper()
    if "CIN" in upper or "IDENTIFIANT" in upper:
        return "cin"
    if "NOM" in upper or "PRENOM" in upper or "REPRESENTANT" in upper:
        return "name"
    if "ADRESSE" in upper or "LIEU" in upper:
        return "address"
    if "DATE" in upper:
        return "date"
    if any(w in upper for w in ["MONTANT", "PRIX", "LOYER", "CAUTION", "CAPITAL", "SALAIRE", "SOMME", "HONORAIRE", "DETTE"]):
        return "amount"
    if any(w in upper for w in ["DUREE", "PREAVIS", "DELAI", "PERIODE"]):
        return "duration"
    if "EMAIL" in upper or "MAIL" in upper:
        return "email"
    if "TELEPHONE" in upper or "TEL" in upper or "PHONE" in upper or "GSM" in upper:
        return "phone"
    return "text"


def process_all():
    count = 0
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        # Build field→section lookup
        field_section = {}
        for s in data.get("sections", []):
            for a in s.get("articles", []):
                for f in a.get("fields", []):
                    if f not in field_section:
                        field_section[f] = (s.get("title_fr", ""), s.get("title_ar", ""))

        for name, meta in data.get("field_metadata", {}).items():
            sec_fr, sec_ar = field_section.get(name, ("", ""))
            hf, ha = generate_help(
                name,
                meta.get("label_fr", name),
                meta.get("label_ar", name),
                sec_fr,
                sec_ar,
            )
            meta["help_fr"] = hf
            meta["help_ar"] = ha

        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        count += 1

    print(f"Generated contextual help for {count} templates")


if __name__ == "__main__":
    process_all()
