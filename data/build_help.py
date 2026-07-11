#!/usr/bin/env python3
"""Generate help_ar/help_fr for all field_metadata using field names + types.

Falls back to Gemini only for fields that can't be auto-generated.
"""

import json
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "data" / "templates"

# Pattern-based help text generation
HELP_PATTERNS = {
    # FR patterns: (keyword, help_fr, help_ar)
    ("NOM",): ("Nom complet de la personne concernée (prénom et nom de famille).", "الاسم الكامل للشخص المعني (الاسم واللقب)."),
    ("CIN",): ("Numéro à 8 chiffres figurant sur la carte d'identité nationale.", "الرقم المكون من 8 أرقام الموجود على بطاقة التعريف الوطنية."),
    ("ADRESSE",): ("Adresse complète du domicile (rue, numéro, ville, code postal).", "العنوان الكامل للسكن (النهج، الرقم، المدينة، الترقيم البريدي)."),
    ("EMAIL", "MAIL"): ("Adresse email valide pour recevoir les communications.", "عنوان بريد إلكتروني صالح لتلقي المراسلات."),
    ("TELEPHONE", "TEL", "GSM"): ("Numéro de téléphone portable tunisien (8 chiffres).", "رقم الهاتف الجوال التونسي (8 أرقام)."),
    ("DATE",): ("Date au format jour/mois/année (ex: 01/01/2026).", "التاريخ بصيغة يوم/شهر/سنة (مثال: 01/01/2026)."),
    ("MONTANT", "PRIX", "SOMME"): ("Montant en dinars tunisiens (ex: 500).", "المبلغ بالدينار التونسي (مثال: 500)."),
    ("DUREE",): ("Durée en années ou en mois (ex: 3 ans, 6 mois).", "المدة بالسنوات أو الأشهر (مثال: 3 سنوات، 6 أشهر)."),
    ("DESCRIPTION",): ("Description détaillée du bien, service ou objet concerné.", "وصف مفصل للشيء أو الخدمة أو الغرض المعني."),
    ("CAPITAL",): ("Montant du capital social en dinars tunisiens.", "مبلغ رأس المال بالدينار التونسي."),
    ("SALAIRE", "REMUNERATION"): ("Salaire mensuel brut en dinars tunisiens.", "الأجر الشهري الخام بالدينار التونسي."),
    ("POSTE", "FONCTION"): ("Intitulé exact du poste ou de la fonction occupée.", "التسمية الدقيقة للمنصب أو الوظيفة."),
    ("IMMATRICULATION", "MATRICULE"): ("Numéro d'immatriculation figurant sur la carte grise.", "رقم الماتركل الموجود على البطاقة الرمادية."),
    ("CHASSIS",): ("Numéro de série du châssis (VIN) gravé sur le véhicule.", "الرقم التسلسلي للشاصي (VIN) المحفور على العربة."),
    ("MODALITES", "MODE"): ("Précisez les conditions ou la méthode (ex: virement, espèces, chèque).", "حدد الشروط أو الطريقة (مثال: تحويل، نقدًا، صك)."),
    ("BANQUE",): ("Nom de la banque où le compte est domicilié.", "اسم البنك الذي يوجد به الحساب."),
    ("TRIBUNAL",): ("Tribunal territorialement compétent en cas de litige.", "المحكمة المختصة ترابيًا في حالة النزاع."),
    ("GOUVERNORAT",): ("Nom du gouvernorat concerné.", "اسم الولاية المعنية."),
    ("DELEGATION",): ("Nom de la délégation concernée.", "اسم المعتمدية المعنية."),
    ("SIGNATURE",): ("Lieu ou date de signature du contrat.", "مكان أو تاريخ إمضاء العقد."),
    ("RNE",): ("Numéro unique du Registre National des Entreprises.", "الرقم الموحد للسجل الوطني للمؤسسات."),
    ("RC",): ("Numéro du Registre de Commerce.", "رقم السجل التجاري."),
    ("MATRICULE_FISCAL", "MF"): ("Identifiant fiscal de l'entreprise (matricule fiscal).", "المعرف الجبائي للمؤسسة (المعرف الجبائي)."),
    ("NUMERO", "NUM_"): ("Numéro de référence du document ou de la pièce concernée.", "الرقم المرجعي للوثيقة أو القطعة المعنية."),
    ("ETAT_CIVIL",): ("État civil complet (célibataire, marié(e), divorcé(e), veuf/veuve).", "الحالة المدنية الكاملة (أعزب، متزوج/ة، مطلق/ة، أرمل/ة)."),
    ("NATIONALITE",): ("Nationalité de la personne (ex: Tunisienne).", "جنسية الشخص (مثال: تونسية)."),
    ("PROFESSION",): ("Profession ou métier exercé.", "المهنة أو الحرفة التي يزاولها."),
    ("QUALITE",): ("Qualité en laquelle la personne agit (ex: gérant, représentant légal).", "الصفة التي يتصرف بها الشخص (مثال: مسير، ممثل قانوني)."),
    ("DEBUT",): ("Date de début d'effet du contrat ou de la prestation.", "تاريخ بدء سريان العقد أو الخدمة."),
    ("FIN",): ("Date de fin du contrat ou de la prestation.", "تاريخ انتهاء العقد أو الخدمة."),
    ("PREAVIS",): ("Délai de préavis en mois avant résiliation (ex: 1, 2, 3).", "مهلة الإعلام المسبق بالأشهر قبل إنهاء العقد (مثال: 1، 2، 3)."),
    ("CAUTION",): ("Montant de la caution/garantie en dinars tunisiens.", "مبلغ التأمين/الضمان بالدينار التونسي."),
    ("LOYER",): ("Montant du loyer mensuel en dinars tunisiens.", "مبلغ معين الكراء الشهري بالدينار التونسي."),
    ("CHARGES",): ("Charges incluses dans le loyer (eau, électricité, etc.).", "المصاريف المشمولة في الكراء (ماء، كهرباء، إلخ)."),
    ("HONORAIRE",): ("Montant des honoraires en dinars tunisiens.", "مبلغ الأتعاب بالدينار التونسي."),
    ("TAUX",): ("Taux en pourcentage (ex: 10 pour 10%).", "النسبة المئوية (مثال: 10 تعني 10%)."),
    ("CONDITIONS",): ("Conditions particulières à préciser.", "شروط خاصة يجب تحديدها."),
    ("OBJET",): ("Objet ou but du contrat/document.", "موضوع أو غرض العقد/الوثيقة."),
    ("DECLARATION",): ("Texte de la déclaration à certifier.", "نص التصريح المراد الشهادة به."),
    ("REPRESENTANT",): ("Nom du représentant légal de la société.", "اسم الممثل القانوني للشركة."),
    ("HEBERGEMENT", "HEBERGEANT", "HEBERGE",): ("Personne qui héberge / Personne hébergée — ne pas confondre.", "الشخص المستضيف / الشخص المستضاف — يجب عدم الخلط بينهما."),
    ("DETTE",): ("Montant de la dette en dinars tunisiens.", "مبلغ الدين بالدينار التونسي."),
    ("CREANCIER",): ("Nom complet de la personne à qui l'argent est dû.", "الاسم الكامل للشخص الذي يستحق المال."),
    ("DEBITEUR",): ("Nom complet de la personne qui doit l'argent.", "الاسم الكامل للشخص الذي عليه المال."),
    ("ASSUREUR",): ("Nom de la compagnie d'assurance.", "اسم شركة التأمين."),
    ("POLICE",): ("Numéro de la police d'assurance.", "رقم وثيقة التأمين."),
    ("ENERGIE", "CARBURANT",): ("Type d'énergie ou de carburant du véhicule.", "نوع الطاقة أو الوقود للعربة."),
    ("KILOMETRAGE", "KM",): ("Kilométrage actuel du véhicule au compteur.", "المسافة المقطوعة الحالية للعربة بالعداد."),
    ("CLASSIFICATION",): ("Classification professionnelle selon la convention collective.", "التصنيف المهني حسب الاتفاقية المشتركة."),
    ("HORAIRES",): ("Horaires de travail (ex: 8h-17h, du lundi au vendredi).", "أوقات العمل (مثال: 8ص-5م، من الإثنين إلى الجمعة)."),
    ("CONGES",): ("Nombre de jours de congés payés par an.", "عدد أيام الراحة مدفوعة الأجر في السنة."),
    ("PERIODE", "PERIODE_"): ("Période concernée (ex: janvier 2026, trimestre 1).", "الفترة المعنية (مثال: جانفي 2026، الثلاثي الأول)."),
    ("MOYEN",): ("Moyen ou méthode utilisé(e).", "الوسيلة أو الطريقة المستعملة."),
    ("COMPTES",): ("Coordonnées bancaires complètes (RIB/IBAN).", "المعلومات البنكية الكاملة (RIB/IBAN)."),
}

def build_help(name: str, label_fr: str = "", label_ar: str = "") -> tuple[str, str]:
    """Return (help_fr, help_ar) for a field name."""
    upper = name.upper().replace("[", "").replace("]", "")

    for keywords, (hf, ha) in HELP_PATTERNS.items():
        if any(kw in upper for kw in keywords):
            return hf, ha

    # Generic fallback
    return (
        f"Veuillez renseigner {label_fr.lower() if label_fr else name.replace('_', ' ').lower()}.",
        f"يرجى إدخال {label_ar if label_ar else name.replace('_', ' ')}.",
    )


def process_all():
    count = 0
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for name, meta in data.get("field_metadata", {}).items():
            hf, ha = build_help(name, meta.get("label_fr", ""), meta.get("label_ar", ""))
            meta["help_fr"] = hf
            meta["help_ar"] = ha
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        count += 1
    print(f"Generated help texts for {count} templates")

if __name__ == "__main__":
    process_all()
