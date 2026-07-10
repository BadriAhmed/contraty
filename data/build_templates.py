"""
Template builder: reads scraped COC/CT/CS articles and generates
bilingual contract template JSON files.
"""
import json
from pathlib import Path
from typing import Optional

DATA_DIR = Path("/home/imari/IdeaProjects/Contraty/data")
TEMPLATE_DIR = DATA_DIR / "templates"
RAW_DIR = DATA_DIR / "raw"

# Load scraped articles
coc_articles = json.loads((RAW_DIR / "coc_clean.json").read_text())
ct_articles = json.loads((RAW_DIR / "ct_clean.json").read_text())
cs_articles = json.loads((RAW_DIR / "cs_clean.json").read_text())

coc = {a["number"]: a["text"] for a in coc_articles}
ct = {a["number"]: a["text"] for a in ct_articles}
cs = {a["number"]: a["text"] for a in cs_articles}


def coc_text(nums) -> str:
    """Get article text(s) from COC, stripping ** markers."""
    if isinstance(nums, int):
        t = coc.get(nums, "")
        return t.replace("** ", "").strip()
    return " ".join(coc_text(n) for n in nums)


def build_template(slug, title_fr, title_ar, category, legal_basis, sections):
    return {
        "id": f"{slug}-v1",
        "title_ar": title_ar,
        "title_fr": title_fr,
        "slug": slug,
        "language": "both",
        "category": category,
        "legal_basis": legal_basis,
        "version": "1.0",
        "reviewed_by": None,
        "review_date": None,
        "source": "public_examples",
        "disclaimer": (
            "Modèle indicatif — non révisé par un avocat. "
            "Voir avertissement légal. / "
            "نموذج إرشادي — لم يراجعه محامٍ. راجع إخلاء المسؤولية القانونية."
        ),
        "sections": sections,
    }


Section = dict  # {"id": str, "title_ar": str, "title_fr": str, "articles": list[dict]}


def article(art_id: str, text_fr: str, text_ar: str, fields: Optional[list[str]] = None):
    return {
        "id": art_id,
        "text_ar": text_ar,
        "text_fr": text_fr,
        "fields": fields or [],
    }


def field_ar(name: str) -> str:
    """Arabic field placeholder"""
    return f"[{name}]"


def field_fr(name: str) -> str:
    """French field placeholder"""
    return f"[{name}]"


# =====================================================================
# TEMPLATE 1: BAIL D'HABITATION
# COC articles 727-827 (Louage des choses)
# =====================================================================
def t1_bail_habitation():
    return build_template(
        slug="bail-habitation",
        title_fr="Contrat de Bail d'Habitation",
        title_ar="عقد كراء مسكن",
        category="immobilier",
        legal_basis="Code des Obligations et des Contrats, articles 727 à 827",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article(
                        "art-bailleur",
                        f"M./Mme {field_fr('NOM_BAILLEUR')}, de nationalité tunisienne, titulaire de la CIN n° {field_fr('CIN_BAILLEUR')}, demeurant à {field_fr('ADRESSE_BAILLEUR')}, ci-après dénommé(e) « le Bailleur ».",
                        f"السيد/ة {field_ar('NOM_BAILLEUR')}، تونسي/ة الجنسية، بطاقة تعريف وطنية عدد {field_ar('CIN_BAILLEUR')}، قاطن/ة بـ {field_ar('ADRESSE_BAILLEUR')}، يشار إليه/ا فيما يلي بـ « المكري ».",
                        ["NOM_BAILLEUR", "CIN_BAILLEUR", "ADRESSE_BAILLEUR"],
                    ),
                    article(
                        "art-preneur",
                        f"M./Mme {field_fr('NOM_PRENEUR')}, de nationalité tunisienne, titulaire de la CIN n° {field_fr('CIN_PRENEUR')}, demeurant à {field_fr('ADRESSE_PRENEUR')}, ci-après dénommé(e) « le Preneur ».",
                        f"السيد/ة {field_ar('NOM_PRENEUR')}، تونسي/ة الجنسية، بطاقة تعريف وطنية عدد {field_ar('CIN_PRENEUR')}، قاطن/ة بـ {field_ar('ADRESSE_PRENEUR')}، يشار إليه/ا فيما يلي بـ « المكتري ».",
                        ["NOM_PRENEUR", "CIN_PRENEUR", "ADRESSE_PRENEUR"],
                    ),
                ],
            },
            {
                "id": "sec-objet",
                "title_ar": "موضوع العقد",
                "title_fr": "Objet du contrat",
                "articles": [
                    article(
                        "art-objet",
                        f"Le Bailleur donne à bail au Preneur, qui accepte, le bien immobilier à usage d'habitation situé à {field_fr('ADRESSE_BIEN')}, composé de {field_fr('DESCRIPTION_BIEN')}.",
                        f"يمنح المكري للمكتري الذي يقبل، العقار المعد للسكن الكائن بـ {field_ar('ADRESSE_BIEN')}، والمتكون من {field_ar('DESCRIPTION_BIEN')}.",
                        ["ADRESSE_BIEN", "DESCRIPTION_BIEN"],
                    ),
                    article(
                        "art-destination",
                        f"Le bien loué est destiné exclusivement à l'habitation du Preneur et de sa famille. {coc_text(729)}",
                        f"العقار المكرى مخصص حصراً لسكن المكتري وعائلته. يشترط أن يكون عقد الكراء مكتوباً إذا زادت مدته عن سنة.",
                        [],
                    ),
                ],
            },
            {
                "id": "sec-duree",
                "title_ar": "المدة",
                "title_fr": "Durée",
                "articles": [
                    article(
                        "art-duree",
                        f"Le présent bail est consenti pour une durée de {field_fr('DUREE_BAIL')} à compter du {field_fr('DATE_DEBUT')}.",
                        f"يبرم عقد الكراء هذا لمدة {field_ar('DUREE_BAIL')} ابتداءً من {field_ar('DATE_DEBUT')}.",
                        ["DUREE_BAIL", "DATE_DEBUT"],
                    ),
                    article(
                        "art-tacite-reconduction",
                        f"{coc_text(792)} A défaut de congé donné par l'une des parties {field_fr('PREAVIS_MOIS')} mois avant l'échéance, le bail sera reconduit tacitement.",
                        f"إذا لم يوجه أي طرف إعلاماً بالإنهاء قبل {field_ar('PREAVIS_MOIS')} أشهر من انتهاء المدة، يجدد العقد ضمنياً.",
                        ["PREAVIS_MOIS"],
                    ),
                    article(
                        "art-resiliation",
                        f"{coc_text(791)} En cas de manquement grave par l'une des parties à ses obligations, l'autre partie pourra demander la résiliation du bail.",
                        f"ينتهي عقد الكراء بانقضاء المدة المتفق عليها. وفي حالة الإخلال الجسيم من قبل أحد الطرفين بالتزاماته، يمكن للطرف الآخر طلب فسخ العقد.",
                        [],
                    ),
                ],
            },
            {
                "id": "sec-financier",
                "title_ar": "الأحكام المالية",
                "title_fr": "Dispositions financières",
                "articles": [
                    article(
                        "art-loyer",
                        f"Le loyer mensuel est fixé à {field_fr('MONTANT_LOYER')} dinars tunisiens, payable le {field_fr('JOUR_PAIEMENT')} de chaque mois. {coc_text([734, 736])}",
                        f"يحدد مبلغ الكراء الشهري بـ {field_ar('MONTANT_LOYER')} ديناراً تونسياً، يدفع في {field_ar('JOUR_PAIEMENT')} من كل شهر.",
                        ["MONTANT_LOYER", "JOUR_PAIEMENT"],
                    ),
                    article(
                        "art-caution",
                        f"Le Preneur verse au Bailleur, à la signature des présentes, une somme de {field_fr('MONTANT_CAUTION')} dinars tunisiens à titre de caution. Cette somme sera restituée au Preneur en fin de bail, déduction faite des éventuelles dégradations et des loyers impayés.",
                        f"يدفع المكتري للمكري عند التوقيع مبلغ {field_ar('MONTANT_CAUTION')} ديناراً تونسياً كضمان. يسترجع هذا المبلغ عند انتهاء الكراء بعد خصم الأضرار والمبالغ غير المدفوعة.",
                        ["MONTANT_CAUTION"],
                    ),
                ],
            },
            {
                "id": "sec-obligations",
                "title_ar": "التزامات الأطراف",
                "title_fr": "Obligations des parties",
                "articles": [
                    article(
                        "art-obligations-bailleur",
                        f"Le Bailleur est tenu de délivrer le bien en bon état d'usage et d'en assurer la jouissance paisible. {coc_text([740, 748, 758])}",
                        f"يلتزم المكري بتسليم العقار في حالة جيدة وضمان التمتع الهادئ به.",
                        [],
                    ),
                    article(
                        "art-obligations-preneur",
                        f"Le Preneur est tenu d'user du bien en bon père de famille, de payer le loyer aux termes convenus et d'entretenir le bien. {coc_text(767)}",
                        f"يلتزم المكتري باستعمال العقار استعمالاً معقولاً وبدفع معين الكراء في الآجال المتفق عليها وبصيانة العقار.",
                        [],
                    ),
                    article(
                        "art-charges",
                        f"Les charges locatives comprennent : {field_fr('CHARGES_INCLUSES')}. Les charges suivantes restent à la charge du Preneur : {field_fr('CHARGES_PRENEUR')}.",
                        f"تشمل أعباء الكراء: {field_ar('CHARGES_INCLUSES')}. ويبقى على عاتق المكتري الأعباء التالية: {field_ar('CHARGES_PRENEUR')}.",
                        ["CHARGES_INCLUSES", "CHARGES_PRENEUR"],
                    ),
                ],
            },
            {
                "id": "sec-divers",
                "title_ar": "أحكام عامة",
                "title_fr": "Dispositions diverses",
                "articles": [
                    article(
                        "art-domicile",
                        f"Pour l'exécution des présentes, les parties font élection de domicile à leurs adresses respectives indiquées ci-dessus.",
                        f"لتنفيذ هذا العقد، يتخذ الطرفان موطناً لهما بعنوانيهما المذكورين أعلاه.",
                        [],
                    ),
                    article(
                        "art-juridiction",
                        f"Tout litige relatif au présent contrat sera de la compétence des tribunaux de {field_fr('TRIBUNAL')}.",
                        f"كل نزاع يتعلق بهذا العقد يكون من اختصاص محاكم {field_ar('TRIBUNAL')}.",
                        ["TRIBUNAL"],
                    ),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article(
                        "art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}, en deux exemplaires originaux.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}، في نظيرين أصليين.",
                        ["LIEU_SIGNATURE", "DATE_SIGNATURE"],
                    ),
                    article(
                        "art-sign-bailleur",
                        f"Le Bailleur\n{field_fr('NOM_BAILLEUR')}\n(Signature précédée de la mention « Lu et approuvé »)",
                        f"المكري\n{field_ar('NOM_BAILLEUR')}\n(إمضاء مسبوق بعبارة « قرأت وأوافق »)",
                        [],
                    ),
                    article(
                        "art-sign-preneur",
                        f"Le Preneur\n{field_fr('NOM_PRENEUR')}\n(Signature précédée de la mention « Lu et approuvé »)",
                        f"المكتري\n{field_ar('NOM_PRENEUR')}\n(إمضاء مسبوق بعبارة « قرأت وأوافق »)",
                        [],
                    ),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 2: RECONNAISSANCE DE DETTE
# COC articles 1054-1103 (Prêt)
# =====================================================================
def t2_reconnaissance_dette():
    return build_template(
        slug="reconnaissance-dette",
        title_fr="Reconnaissance de Dette",
        title_ar="اعتراف بدين",
        category="pret-finance",
        legal_basis="Code des Obligations et des Contrats, articles 1054 à 1103 (Prêt)",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article(
                        "art-debiteur",
                        f"Je soussigné(e), M./Mme {field_fr('NOM_DEBITEUR')}, CIN n° {field_fr('CIN_DEBITEUR')}, demeurant à {field_fr('ADRESSE_DEBITEUR')}, reconnaît devoir à M./Mme {field_fr('NOM_CREANCIER')}, CIN n° {field_fr('CIN_CREANCIER')}, demeurant à {field_fr('ADRESSE_CREANCIER')}, la somme de {field_fr('MONTANT_DETTE')} dinars tunisiens.",
                        f"أقر أنا الممضي أسفله، السيد/ة {field_ar('NOM_DEBITEUR')}، ب.ت.و عدد {field_ar('CIN_DEBITEUR')}، القاطن/ة بـ {field_ar('ADRESSE_DEBITEUR')}، بمديونيتي لفائدة السيد/ة {field_ar('NOM_CREANCIER')}، ب.ت.و عدد {field_ar('CIN_CREANCIER')}، القاطن/ة بـ {field_ar('ADRESSE_CREANCIER')}، بمبلغ {field_ar('MONTANT_DETTE')} ديناراً تونسياً.",
                        ["NOM_DEBITEUR","CIN_DEBITEUR","ADRESSE_DEBITEUR","NOM_CREANCIER","CIN_CREANCIER","ADRESSE_CREANCIER","MONTANT_DETTE"],
                    ),
                ],
            },
            {
                "id": "sec-objet",
                "title_ar": "سبب الدين",
                "title_fr": "Origine de la dette",
                "articles": [
                    article(
                        "art-cause",
                        f"Cette somme m'a été remise à titre de {field_fr('MOTIF_DETTE')} le {field_fr('DATE_REMISE')}. {coc_text(1081)}",
                        f"تم تسليمي هذا المبلغ على سبيل {field_ar('MOTIF_DETTE')} بتاريخ {field_ar('DATE_REMISE')}.",
                        ["MOTIF_DETTE", "DATE_REMISE"],
                    ),
                ],
            },
            {
                "id": "sec-remboursement",
                "title_ar": "طرق السداد",
                "title_fr": "Modalités de remboursement",
                "articles": [
                    article(
                        "art-modalites",
                        f"Je m'engage à rembourser cette somme selon les modalités suivantes : {field_fr('MODALITES_REMBOURSEMENT')}.",
                        f"ألتزم بتسديد هذا المبلغ حسب الطرق التالية: {field_ar('MODALITES_REMBOURSEMENT')}.",
                        ["MODALITES_REMBOURSEMENT"],
                    ),
                    article(
                        "art-echeance",
                        f"Le remboursement intégral devra intervenir au plus tard le {field_fr('DATE_ECHEANCE')}.",
                        f"يجب أن يتم السداد الكامل في أجل أقصاه {field_ar('DATE_ECHEANCE')}.",
                        ["DATE_ECHEANCE"],
                    ),
                    article(
                        "art-interets",
                        f"Le cas échéant, la présente reconnaissance de dette porte intérêt au taux de {field_fr('TAUX_INTERET')} % par an à compter du {field_fr('DATE_DEBUT_INTERETS')}. {coc_text([1095, 1097, 1098, 1099, 1100])}",
                        f"عند الاقتضاء، يترتب على هذا الاعتراف بدين فائدة بنسبة {field_ar('TAUX_INTERET')} % سنوياً ابتداءً من {field_ar('DATE_DEBUT_INTERETS')}.",
                        ["TAUX_INTERET", "DATE_DEBUT_INTERETS"],
                    ),
                ],
            },
            {
                "id": "sec-garanties",
                "title_ar": "الضمانات",
                "title_fr": "Garanties",
                "articles": [
                    article(
                        "art-garanties",
                        f"En garantie du remboursement, le débiteur {field_fr('GARANTIES_EVENTUELLES')}.",
                        f"ضماناً للسداد، قام المدين بـ {field_ar('GARANTIES_EVENTUELLES')}.",
                        ["GARANTIES_EVENTUELLES"],
                    ),
                ],
            },
            {
                "id": "sec-divers",
                "title_ar": "أحكام عامة",
                "title_fr": "Dispositions diverses",
                "articles": [
                    article(
                        "art-frais",
                        f"En cas de recouvrement contentieux, le débiteur supportera tous les frais, droits et honoraires.",
                        f"في حالة الاستخلاص عن طريق القضاء، يتحمل المدين جميع المصاريف والمعاليم والأتعاب.",
                        [],
                    ),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article(
                        "art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}.",
                        ["LIEU_SIGNATURE", "DATE_SIGNATURE"],
                    ),
                    article(
                        "art-sign-debiteur",
                        f"Le Débiteur\n{field_fr('NOM_DEBITEUR')}\n(Signature précédée de la mention manuscrite « Bon pour reconnaissance de dette de la somme de {field_fr('MONTANT_DETTE')} dinars »)",
                        f"المدين\n{field_ar('NOM_DEBITEUR')}\n(إمضاء مسبوق بعبارة « أقر وأتعهد بدفع مبلغ {field_ar('MONTANT_DETTE')} ديناراً »)",
                        [],
                    ),
                    article(
                        "art-sign-creancier",
                        f"Le Créancier\n{field_fr('NOM_CREANCIER')}\n(Signature précédée de la mention « Bon pour accord »)",
                        f"الدائن\n{field_ar('NOM_CREANCIER')}\n(إمضاء مسبوق بعبارة « موافقة »)",
                        [],
                    ),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 3: CONTRAT CDI
# COC 828-953 + CT partial
# =====================================================================
def t3_contrat_cdi():
    # Build from COC louage de services (853+) and CT convention collective
    cotisation_text = ct.get(6, "")[:300]  # truncated - CDD rules
    return build_template(
        slug="contrat-cdi",
        title_fr="Contrat de Travail à Durée Indéterminée",
        title_ar="عقد عمل غير محدد المدة",
        category="travail",
        legal_basis="Code du Travail (Loi n° 66-27 du 30 avril 1966) et Code des Obligations et des Contrats, articles 828 à 953",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article(
                        "art-employeur",
                        f"La société {field_fr('NOM_ENTREPRISE')}, au capital de {field_fr('CAPITAL')} dinars, inscrite au RNE sous le n° {field_fr('RNE')}, sise {field_fr('ADRESSE_ENTREPRISE')}, représentée par M./Mme {field_fr('REPRESENTANT')}, ci-après dénommée « l'Employeur ».",
                        f"شركة {field_ar('NOM_ENTREPRISE')}، رأس مالها {field_ar('CAPITAL')} ديناراً، مسجلة بالسجل الوطني للمؤسسات تحت عدد {field_ar('RNE')}، الكائنة بـ {field_ar('ADRESSE_ENTREPRISE')}، ويمثلها السيد/ة {field_ar('REPRESENTANT')}، يشار إليها فيما يلي بـ « المؤجر ».",
                        ["NOM_ENTREPRISE","CAPITAL","RNE","ADRESSE_ENTREPRISE","REPRESENTANT"],
                    ),
                    article(
                        "art-salarie",
                        f"M./Mme {field_fr('NOM_SALARIE')}, CIN n° {field_fr('CIN_SALARIE')}, demeurant à {field_fr('ADRESSE_SALARIE')}, ci-après dénommé(e) « le Salarié ».",
                        f"السيد/ة {field_ar('NOM_SALARIE')}، ب.ت.و عدد {field_ar('CIN_SALARIE')}، القاطن/ة بـ {field_ar('ADRESSE_SALARIE')}، يشار إليه/ا فيما يلي بـ « الأجير ».",
                        ["NOM_SALARIE","CIN_SALARIE","ADRESSE_SALARIE"],
                    ),
                ],
            },
            {
                "id": "sec-engagement",
                "title_ar": "الالتزام بالعمل",
                "title_fr": "Engagement",
                "articles": [
                    article(
                        "art-embauche",
                        f"Le Salarié est engagé à compter du {field_fr('DATE_DEBUT')} en qualité de {field_fr('POSTE')}, sous la classification professionnelle {field_fr('CLASSIFICATION')}.",
                        f"يلتحق الأجير بعمله ابتداءً من {field_ar('DATE_DEBUT')} بصفة {field_ar('POSTE')}، تحت التصنيف المهني {field_ar('CLASSIFICATION')}.",
                        ["DATE_DEBUT","POSTE","CLASSIFICATION"],
                    ),
                    article(
                        "art-lieu",
                        f"Le lieu de travail est fixé à {field_fr('LIEU_TRAVAIL')}.",
                        f"يحدد مكان العمل بـ {field_ar('LIEU_TRAVAIL')}.",
                        ["LIEU_TRAVAIL"],
                    ),
                ],
            },
            {
                "id": "sec-periode-essai",
                "title_ar": "فترة الاختبار",
                "title_fr": "Période d'essai",
                "articles": [
                    article(
                        "art-essai",
                        f"Le Salarié est soumis à une période d'essai de {field_fr('DUREE_ESSAI')} mois, au cours de laquelle chacune des parties pourra rompre le contrat sans indemnité.",
                        f"يخضع الأجير لفترة اختبار مدتها {field_ar('DUREE_ESSAI')} أشهر، يمكن خلالها لكل من الطرفين إنهاء العقد دون تعويض.",
                        ["DUREE_ESSAI"],
                    ),
                ],
            },
            {
                "id": "sec-remuneration",
                "title_ar": "الأجر",
                "title_fr": "Rémunération",
                "articles": [
                    article(
                        "art-salaire",
                        f"Le salaire mensuel brut est fixé à {field_fr('SALAIRE')} dinars tunisiens, payable le {field_fr('JOUR_PAIE')} de chaque mois. {coc_text(828)}",
                        f"يحدد الأجر الشهري الخام بـ {field_ar('SALAIRE')} ديناراً تونسياً، يدفع في {field_ar('JOUR_PAIE')} من كل شهر.",
                        ["SALAIRE","JOUR_PAIE"],
                    ),
                    article(
                        "art-avantages",
                        f"Le Salarié bénéficie des avantages suivants : {field_fr('AVANTAGES')}.",
                        f"يتمتع الأجير بالامتيازات التالية: {field_ar('AVANTAGES')}.",
                        ["AVANTAGES"],
                    ),
                ],
            },
            {
                "id": "sec-duree-travail",
                "title_ar": "مدة العمل",
                "title_fr": "Durée du travail",
                "articles": [
                    article(
                        "art-horaires",
                        f"La durée hebdomadaire de travail est de {field_fr('HEURES_SEMAINE')} heures, réparties comme suit : {field_fr('HORAIRES')}.",
                        f"المدة الأسبوعية للعمل هي {field_ar('HEURES_SEMAINE')} ساعة، توزع كالتالي: {field_ar('HORAIRES')}.",
                        ["HEURES_SEMAINE","HORAIRES"],
                    ),
                    article(
                        "art-conges",
                        f"Le Salarié a droit à un congé annuel payé de {field_fr('JOURS_CONGES')} jours ouvrables.",
                        f"يحق للأجير التمتع براحة سنوية مدفوعة الأجر مدتها {field_ar('JOURS_CONGES')} يوم عمل.",
                        ["JOURS_CONGES"],
                    ),
                ],
            },
            {
                "id": "sec-obligations",
                "title_ar": "التزامات الأطراف",
                "title_fr": "Obligations",
                "articles": [
                    article(
                        "art-obligations-salarie",
                        f"Le Salarié s'engage à exercer ses fonctions avec diligence et loyauté, à respecter le règlement intérieur et à observer le secret professionnel. {coc_text([854, 855])}",
                        f"يلتزم الأجير بأداء مهامه بكل جد وإخلاص واحترام النظام الداخلي والمحافظة على السر المهني.",
                        [],
                    ),
                    article(
                        "art-obligations-employeur",
                        f"L'Employeur s'engage à fournir au Salarié les moyens nécessaires à l'exécution de son travail et à respecter les dispositions du Code du Travail. {coc_text([856, 857])}",
                        f"يلتزم المؤجر بتوفير الوسائل الضرورية للأجير لأداء عمله وباحترام أحكام مجلة الشغل.",
                        [],
                    ),
                ],
            },
            {
                "id": "sec-rupture",
                "title_ar": "إنهاء العقد",
                "title_fr": "Rupture du contrat",
                "articles": [
                    article(
                        "art-preavis",
                        f"En cas de rupture du contrat, un préavis de {field_fr('PREAVIS_MOIS')} mois devra être respecté, sauf faute grave.",
                        f"في حالة إنهاء العقد، يجب احترام أجل إعلام مسبق بـ {field_ar('PREAVIS_MOIS')} أشهر، ما لم تكن هناك خطأ جسيم.",
                        ["PREAVIS_MOIS"],
                    ),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article(
                        "art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}, en deux exemplaires.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}، في نظيرين.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"],
                    ),
                    article("art-sign-employeur",
                        f"L'Employeur\n{field_fr('REPRESENTANT')}",
                        f"المؤجر\n{field_ar('REPRESENTANT')}", []),
                    article("art-sign-salarie",
                        f"Le Salarié\n{field_fr('NOM_SALARIE')}",
                        f"الأجير\n{field_ar('NOM_SALARIE')}", []),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 4: STATUTS SARL
# CS 90-159 + COC 1226-1451
# =====================================================================
def t4_statuts_sarl():
    cs_text = lambda n: cs.get(n, "").replace("** ", "").strip() if cs.get(n) else ""
    return build_template(
        slug="statuts-sarl",
        title_fr="Statuts de SARL",
        title_ar="القانون الأساسي لشركة ذات مسؤولية محدودة",
        category="societes",
        legal_basis="Code des Sociétés Commerciales, articles 90 à 159 et Code des Obligations et des Contrats, articles 1226 à 1451",
        sections=[
            {
                "id": "sec-constitution",
                "title_ar": "التأسيس",
                "title_fr": "Constitution",
                "articles": [
                    article("art-forme",
                        f"Il est formé entre les soussignés une Société à Responsabilité Limitée régie par le Code des Sociétés Commerciales. {cs_text(90)}",
                        f"تتكون بين الممضين أسفله شركة ذات مسؤولية محدودة تخضع لأحكام مجلة الشركات التجارية.",
                        []),
                    article("art-denomination",
                        f"La société a pour dénomination : « {field_fr('DENOMINATION')} ».",
                        f"تسمية الشركة: « {field_ar('DENOMINATION')} ».",
                        ["DENOMINATION"]),
                ],
            },
            {
                "id": "sec-objet",
                "title_ar": "الغرض",
                "title_fr": "Objet social",
                "articles": [
                    article("art-objet",
                        f"La société a pour objet : {field_fr('OBJET_SOCIAL')}.",
                        f"غرض الشركة: {field_ar('OBJET_SOCIAL')}.",
                        ["OBJET_SOCIAL"]),
                ],
            },
            {
                "id": "sec-siege-duree",
                "title_ar": "المقر والمدة",
                "title_fr": "Siège — Durée",
                "articles": [
                    article("art-siege",
                        f"Le siège social est fixé à {field_fr('SIEGE')}.",
                        f"يقع المقر الاجتماعي للشركة بـ {field_ar('SIEGE')}.",
                        ["SIEGE"]),
                    article("art-duree",
                        f"La durée de la société est fixée à {field_fr('DUREE_ANNEE')} années à compter de son immatriculation au RNE.",
                        f"تحدد مدة الشركة بـ {field_ar('DUREE_ANNEE')} سنة ابتداءً من تسجيلها بالسجل الوطني للمؤسسات.",
                        ["DUREE_ANNEE"]),
                ],
            },
            {
                "id": "sec-capital",
                "title_ar": "رأس المال",
                "title_fr": "Capital social",
                "articles": [
                    article("art-capital",
                        f"Le capital social est fixé à {field_fr('CAPITAL')} dinars tunisiens, divisé en {field_fr('NB_PARTS')} parts sociales de {field_fr('VALEUR_NOMINALE')} dinars chacune. {cs_text(5)}",
                        f"يحدد رأس مال الشركة بـ {field_ar('CAPITAL')} ديناراً تونسياً، مقسم إلى {field_ar('NB_PARTS')} حصة اجتماعية قيمة كل منها {field_ar('VALEUR_NOMINALE')} ديناراً.",
                        ["CAPITAL","NB_PARTS","VALEUR_NOMINALE"]),
                    article("art-repartition",
                        f"Les parts sont réparties comme suit : {field_fr('REPARTITION_PARTS')}.",
                        f"توزع الحصص كما يلي: {field_ar('REPARTITION_PARTS')}.",
                        ["REPARTITION_PARTS"]),
                ],
            },
            {
                "id": "sec-gerance",
                "title_ar": "التسيير",
                "title_fr": "Gérance",
                "articles": [
                    article("art-gerant",
                        f"La société est administrée par {field_fr('NOM_GERANT')}, gérant, nommé pour une durée {field_fr('DUREE_MANDAT_GERANT')}. {cs_text(112)}",
                        f"تدار الشركة من قبل السيد/ة {field_ar('NOM_GERANT')}، بصفته/ا متصرفاً، لمدة {field_ar('DUREE_MANDAT_GERANT')}.",
                        ["NOM_GERANT","DUREE_MANDAT_GERANT"]),
                ],
            },
            {
                "id": "sec-exercice",
                "title_ar": "السنة المالية",
                "title_fr": "Exercice social",
                "articles": [
                    article("art-exercice",
                        f"L'exercice social commence le 1er janvier et se termine le 31 décembre de chaque année.",
                        f"تبدأ السنة المالية للشركة في 1 جانفي وتنتهي في 31 ديسمبر من كل سنة.",
                        []),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article("art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
                    article("art-sign-associes",
                        f"Les Associés\n{field_fr('REPARTITION_PARTS')}\n(Signatures précédées de la mention « Lu et approuvé »)",
                        f"الشركاء\n{field_ar('REPARTITION_PARTS')}\n(إمضاءات مسبوقة بعبارة « قرأت وأوافق »)",
                        []),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 5: PRESTATION DE SERVICES
# COC 828-887
# =====================================================================
def t5_prestation_services():
    return build_template(
        slug="prestation-services",
        title_fr="Contrat de Prestation de Services",
        title_ar="عقد تقديم خدمات",
        category="services",
        legal_basis="Code des Obligations et des Contrats, articles 828 à 953 (Louage d'ouvrage)",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article("art-client",
                        f"La société {field_fr('NOM_CLIENT')}, sise {field_fr('ADRESSE_CLIENT')}, représentée par M./Mme {field_fr('REPRESENTANT_CLIENT')}, ci-après dénommée « le Client ».",
                        f"شركة {field_ar('NOM_CLIENT')}، الكائنة بـ {field_ar('ADRESSE_CLIENT')}، ويمثلها السيد/ة {field_ar('REPRESENTANT_CLIENT')}، يشار إليها بـ « الحريف ».",
                        ["NOM_CLIENT","ADRESSE_CLIENT","REPRESENTANT_CLIENT"]),
                    article("art-prestataire",
                        f"La société {field_fr('NOM_PRESTATAIRE')}, sise {field_fr('ADRESSE_PRESTATAIRE')}, représentée par M./Mme {field_fr('REPRESENTANT_PRESTATAIRE')}, ci-après dénommée « le Prestataire ».",
                        f"شركة {field_ar('NOM_PRESTATAIRE')}، الكائنة بـ {field_ar('ADRESSE_PRESTATAIRE')}، ويمثلها السيد/ة {field_ar('REPRESENTANT_PRESTATAIRE')}، يشار إليها بـ « مقدم الخدمات ».",
                        ["NOM_PRESTATAIRE","ADRESSE_PRESTATAIRE","REPRESENTANT_PRESTATAIRE"]),
                ],
            },
            {
                "id": "sec-objet",
                "title_ar": "موضوع العقد",
                "title_fr": "Objet du contrat",
                "articles": [
                    article("art-prestations",
                        f"Le Prestataire s'engage à réaliser les prestations suivantes : {field_fr('DESCRIPTION_PRESTATIONS')}. {coc_text(828)}",
                        f"يلتزم مقدم الخدمات بإنجاز الخدمات التالية: {field_ar('DESCRIPTION_PRESTATIONS')}.",
                        ["DESCRIPTION_PRESTATIONS"]),
                ],
            },
            {
                "id": "sec-prix",
                "title_ar": "المقابل",
                "title_fr": "Rémunération",
                "articles": [
                    article("art-honoraires",
                        f"En contrepartie des prestations, le Client versera au Prestataire la somme de {field_fr('MONTANT_TOTAL')} dinars tunisiens (HT), payable selon les modalités suivantes : {field_fr('MODALITES_PAIEMENT')}.",
                        f"مقابل الخدمات، يدفع الحريف لمقدم الخدمات مبلغ {field_ar('MONTANT_TOTAL')} ديناراً تونسياً (دون الأداء)، حسب الطرق التالية: {field_ar('MODALITES_PAIEMENT')}.",
                        ["MONTANT_TOTAL","MODALITES_PAIEMENT"]),
                ],
            },
            {
                "id": "sec-duree",
                "title_ar": "المدة",
                "title_fr": "Durée",
                "articles": [
                    article("art-duree",
                        f"Le présent contrat est conclu pour une durée de {field_fr('DUREE')} à compter du {field_fr('DATE_DEBUT')}. {coc_text([866, 867])}",
                        f"يبرم هذا العقد لمدة {field_ar('DUREE')} ابتداءً من {field_ar('DATE_DEBUT')}.",
                        ["DUREE","DATE_DEBUT"]),
                ],
            },
            {
                "id": "sec-obligations",
                "title_ar": "التزامات الأطراف",
                "title_fr": "Obligations",
                "articles": [
                    article("art-obligations-prestataire",
                        f"Le Prestataire s'engage à exécuter les prestations conformément aux règles de l'art. {coc_text([829, 830])}",
                        f"يلتزم مقدم الخدمات بتنفيذ الخدمات طبقاً لأصول المهنة.",
                        []),
                    article("art-obligations-client",
                        f"Le Client s'engage à fournir au Prestataire toutes les informations nécessaires et à lui assurer l'accès aux locaux.",
                        f"يلتزم الحريف بتوفير جميع المعلومات الضرورية لمقدم الخدمات وضمان ولوجه إلى الأماكن.",
                        []),
                ],
            },
            {
                "id": "sec-responsabilite",
                "title_ar": "المسؤولية",
                "title_fr": "Responsabilité",
                "articles": [
                    article("art-garantie",
                        f"Le Prestataire est tenu à une obligation de moyens. {coc_text([856, 857, 858])}",
                        f"يلتزم مقدم الخدمات ببذل العناية اللازمة دون ضمان نتيجة.",
                        []),
                ],
            },
            {
                "id": "sec-resiliation",
                "title_ar": "الإنهاء",
                "title_fr": "Résiliation",
                "articles": [
                    article("art-resiliation",
                        f"Le contrat peut être résilié par l'une ou l'autre des parties moyennant un préavis de {field_fr('PREAVIS_JOURS')} jours, par lettre recommandée avec accusé de réception.",
                        f"يمكن لكل من الطرفين إنهاء العقد بعد إعلام مسبق بـ {field_ar('PREAVIS_JOURS')} يوماً، بمكتوب مضمون الوصول مع الإعلام بالبلوغ.",
                        ["PREAVIS_JOURS"]),
                ],
            },
            {
                "id": "sec-divers",
                "title_ar": "أحكام عامة",
                "title_fr": "Dispositions diverses",
                "articles": [
                    article("art-confidentialite",
                        f"Les parties s'engagent à respecter la confidentialité des informations échangées.",
                        f"يلتزم الطرفان باحترام سرية المعلومات المتبادلة.",
                        []),
                    article("art-juridiction",
                        f"Tout litige sera soumis aux tribunaux de {field_fr('TRIBUNAL')}.",
                        f"كل نزاع يعرض على محاكم {field_ar('TRIBUNAL')}.",
                        ["TRIBUNAL"]),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article("art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
                    article("art-sign-client",
                        f"Le Client\n{field_fr('REPRESENTANT_CLIENT')}",
                        f"الحريف\n{field_ar('REPRESENTANT_CLIENT')}", []),
                    article("art-sign-prestataire",
                        f"Le Prestataire\n{field_fr('REPRESENTANT_PRESTATAIRE')}",
                        f"مقدم الخدمات\n{field_ar('REPRESENTANT_PRESTATAIRE')}", []),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 6: PROCURATION SPECIALE
# COC 1104-1194
# =====================================================================
def t6_procuration_speciale():
    return build_template(
        slug="procuration-speciale",
        title_fr="Procuration Spéciale",
        title_ar="وكالة خاصة",
        category="civil-famille",
        legal_basis="Code des Obligations et des Contrats, articles 1104 à 1194 (Mandat)",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article("art-mandant",
                        f"Je soussigné(e), M./Mme {field_fr('NOM_MANDANT')}, CIN n° {field_fr('CIN_MANDANT')}, demeurant à {field_fr('ADRESSE_MANDANT')}, constitue pour mon mandataire spécial M./Mme {field_fr('NOM_MANDATAIRE')}, CIN n° {field_fr('CIN_MANDATAIRE')}, demeurant à {field_fr('ADRESSE_MANDATAIRE')}. {coc_text([1104, 1105, 1106, 1107])}",
                        f"أنا الممضي أسفله، السيد/ة {field_ar('NOM_MANDANT')}، ب.ت.و عدد {field_ar('CIN_MANDANT')}، القاطن/ة بـ {field_ar('ADRESSE_MANDANT')}، أوكل بموجب هذه الوكالة الخاصة للسيد/ة {field_ar('NOM_MANDATAIRE')}، ب.ت.و عدد {field_ar('CIN_MANDATAIRE')}، القاطن/ة بـ {field_ar('ADRESSE_MANDATAIRE')}.",
                        ["NOM_MANDANT","CIN_MANDANT","ADRESSE_MANDANT","NOM_MANDATAIRE","CIN_MANDATAIRE","ADRESSE_MANDATAIRE"]),
                ],
            },
            {
                "id": "sec-pouvoirs",
                "title_ar": "الصلاحيات",
                "title_fr": "Pouvoirs",
                "articles": [
                    article("art-mission",
                        f"Le mandataire a pouvoir de, au nom et pour le compte du mandant : {field_fr('MISSION_SPECIALE')}. {coc_text([1116, 1117, 1118])}",
                        f"للوكيل صلاحية القيام، باسم الموكل ولحسابه، بما يلي: {field_ar('MISSION_SPECIALE')}.",
                        ["MISSION_SPECIALE"]),
                ],
            },
            {
                "id": "sec-duree",
                "title_ar": "المدة",
                "title_fr": "Durée",
                "articles": [
                    article("art-duree",
                        f"La présente procuration est valable jusqu'au {field_fr('DATE_FIN')}. {coc_text([1172, 1173])}",
                        f"هذه الوكالة صالحة إلى غاية {field_ar('DATE_FIN')}.",
                        ["DATE_FIN"]),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article("art-legalisation",
                        f"La signature du mandant doit être légalisée par les autorités compétentes.",
                        f"يجب التصديق على إمضاء الموكل لدى السلط المختصة.",
                        []),
                    article("art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
                    article("art-sign-mandant",
                        f"Le Mandant\n{field_fr('NOM_MANDANT')}\n(Signature précédée de « Bon pour procuration »)",
                        f"الموكل\n{field_ar('NOM_MANDANT')}\n(إمضاء مسبوق بعبارة « وكالة صحيحة »)",
                        []),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 7: PRET ENTRE PARTICULIERS
# COC 1054-1103
# =====================================================================
def t7_pret_particuliers():
    return build_template(
        slug="pret-particuliers",
        title_fr="Contrat de Prêt entre Particuliers",
        title_ar="عقد قرض بين الخواص",
        category="pret-finance",
        legal_basis="Code des Obligations et des Contrats, articles 1054 à 1103 (Prêt)",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article("art-preteur",
                        f"M./Mme {field_fr('NOM_PRETEUR')}, CIN n° {field_fr('CIN_PRETEUR')}, demeurant à {field_fr('ADRESSE_PRETEUR')}, ci-après dénommé(e) « le Prêteur ».",
                        f"السيد/ة {field_ar('NOM_PRETEUR')}، ب.ت.و عدد {field_ar('CIN_PRETEUR')}، القاطن/ة بـ {field_ar('ADRESSE_PRETEUR')}، يشار إليه/ا بـ « المقرض ».",
                        ["NOM_PRETEUR","CIN_PRETEUR","ADRESSE_PRETEUR"]),
                    article("art-emprunteur",
                        f"M./Mme {field_fr('NOM_EMPRUNTEUR')}, CIN n° {field_fr('CIN_EMPRUNTEUR')}, demeurant à {field_fr('ADRESSE_EMPRUNTEUR')}, ci-après dénommé(e) « l'Emprunteur ».",
                        f"السيد/ة {field_ar('NOM_EMPRUNTEUR')}، ب.ت.و عدد {field_ar('CIN_EMPRUNTEUR')}، القاطن/ة بـ {field_ar('ADRESSE_EMPRUNTEUR')}، يشار إليه/ا بـ « المقترض ».",
                        ["NOM_EMPRUNTEUR","CIN_EMPRUNTEUR","ADRESSE_EMPRUNTEUR"]),
                ],
            },
            {
                "id": "sec-objet",
                "title_ar": "موضوع القرض",
                "title_fr": "Objet du prêt",
                "articles": [
                    article("art-montant",
                        f"Le Prêteur prête à l'Emprunteur, qui accepte, la somme de {field_fr('MONTANT')} dinars tunisiens. {coc_text([1054, 1081])}",
                        f"يقرض المقرض للمقترض الذي يقبل، مبلغ {field_ar('MONTANT')} ديناراً تونسياً.",
                        ["MONTANT"]),
                    article("art-destination",
                        f"Ce prêt est destiné à : {field_fr('DESTINATION_PRET')}.",
                        f"يخصص هذا القرض لـ: {field_ar('DESTINATION_PRET')}.",
                        ["DESTINATION_PRET"]),
                ],
            },
            {
                "id": "sec-remboursement",
                "title_ar": "السداد",
                "title_fr": "Remboursement",
                "articles": [
                    article("art-modalites",
                        f"L'Emprunteur s'engage à rembourser le prêt selon les modalités suivantes : {field_fr('MODALITES')}. La date de mise à disposition des fonds est fixée au {field_fr('DATE_DEBLOCAGE')}. Le remboursement intégral devra intervenir au plus tard le {field_fr('DATE_ECHEANCE_FINALE')}.",
                        f"يلتزم المقترض بسداد القرض حسب الطرق التالية: {field_ar('MODALITES')}. تاريخ وضع الأموال على ذمة المقترض: {field_ar('DATE_DEBLOCAGE')}. يجب أن يتم السداد الكامل في أجل أقصاه {field_ar('DATE_ECHEANCE_FINALE')}.",
                        ["MODALITES","DATE_DEBLOCAGE","DATE_ECHEANCE_FINALE"]),
                ],
            },
            {
                "id": "sec-interets",
                "title_ar": "الفائدة",
                "title_fr": "Intérêts",
                "articles": [
                    article("art-taux",
                        f"Le prêt est {field_fr('AVEC_INTERET')} (consenti avec / sans intérêt). Si le prêt est avec intérêt, le taux annuel est fixé à {field_fr('TAUX')} %. {coc_text([1095, 1097, 1098, 1099, 1100, 1101, 1102, 1103])}",
                        f"القرض {field_ar('AVEC_INTERET')} (بفائدة / بدون فائدة). إذا كان القرض بفائدة، يحدد النسب السنوي بـ {field_ar('TAUX')} %.",
                        ["AVEC_INTERET","TAUX"]),
                ],
            },
            {
                "id": "sec-garanties",
                "title_ar": "الضمانات",
                "title_fr": "Garanties",
                "articles": [
                    article("art-garanties",
                        f"En garantie du remboursement, {field_fr('GARANTIES_PRET')}.",
                        f"ضماناً لسداد القرض، {field_ar('GARANTIES_PRET')}.",
                        ["GARANTIES_PRET"]),
                ],
            },
            {
                "id": "sec-remboursement-anticipe",
                "title_ar": "السداد المسبق",
                "title_fr": "Remboursement anticipé",
                "articles": [
                    article("art-anticipe",
                        f"L'Emprunteur pourra se libérer par anticipation, en totalité ou en partie, {field_fr('CONDITIONS_ANTICIPE')}.",
                        f"يمكن للمقترض أن يسدد القرض كلياً أو جزئياً قبل الأجل، {field_ar('CONDITIONS_ANTICIPE')}.",
                        ["CONDITIONS_ANTICIPE"]),
                ],
            },
            {
                "id": "sec-defaut",
                "title_ar": "الإخلال بشروط السداد",
                "title_fr": "Défaut de paiement",
                "articles": [
                    article("art-defaut",
                        f"En cas de défaut de paiement à l'échéance, le Prêteur pourra exiger le remboursement immédiat du solde restant dû, sans mise en demeure préalable.",
                        f"في حالة عدم السداد في الأجل، يحق للمقرض المطالبة بالسداد الفوري للمبلغ المتبقي دون حاجة إلى توجيه إنذار مسبق.",
                        []),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article("art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}, en deux exemplaires.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}، في نظيرين.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
                    article("art-sign-preteur",
                        f"Le Prêteur\n{field_fr('NOM_PRETEUR')}\n(Signature précédée de « Bon pour prêt de {field_fr('MONTANT')} dinars »)",
                        f"المقرض\n{field_ar('NOM_PRETEUR')}\n(إمضاء مسبوق بعبارة « أقرضت مبلغ {field_ar('MONTANT')} ديناراً »)",
                        []),
                    article("art-sign-emprunteur",
                        f"L'Emprunteur\n{field_fr('NOM_EMPRUNTEUR')}\n(Signature précédée de « Bon pour reconnaissance de dette de {field_fr('MONTANT')} dinars »)",
                        f"المقترض\n{field_ar('NOM_EMPRUNTEUR')}\n(إمضاء مسبوق بعبارة « أقر وتعهد بسداد مبلغ {field_ar('MONTANT')} ديناراً »)",
                        []),
                ],
            },
        ],
    )


# =====================================================================
# TEMPLATE 8: NDA / CONFIDENTIALITE
# COC Livre I obligations générales (no specific section)
# =====================================================================
def t8_nda():
    return build_template(
        slug="nda-confidentialite",
        title_fr="Accord de Confidentialité (NDA)",
        title_ar="اتفاقية سرية",
        category="services",
        legal_basis="Code des Obligations et des Contrats, Livre Premier (Obligations en général)",
        sections=[
            {
                "id": "sec-parties",
                "title_ar": "الأطراف",
                "title_fr": "Parties",
                "articles": [
                    article("art-divulgant",
                        f"La société {field_fr('NOM_PARTIE_A')}, sise {field_fr('ADRESSE_PARTIE_A')}, représentée par M./Mme {field_fr('REPRESENTANT_A')}, ci-après dénommée « la Partie Divulgante ».",
                        f"شركة {field_ar('NOM_PARTIE_A')}، الكائنة بـ {field_ar('ADRESSE_PARTIE_A')}، ويمثلها السيد/ة {field_ar('REPRESENTANT_A')}، يشار إليها بـ « الطرف المفصح ».",
                        ["NOM_PARTIE_A","ADRESSE_PARTIE_A","REPRESENTANT_A"]),
                    article("art-recepteur",
                        f"La société {field_fr('NOM_PARTIE_B')}, sise {field_fr('ADRESSE_PARTIE_B')}, représentée par M./Mme {field_fr('REPRESENTANT_B')}, ci-après dénommée « la Partie Réceptrice ».",
                        f"شركة {field_ar('NOM_PARTIE_B')}، الكائنة بـ {field_ar('ADRESSE_PARTIE_B')}، ويمثلها السيد/ة {field_ar('REPRESENTANT_B')}، يشار إليها بـ « الطرف المتلقي ».",
                        ["NOM_PARTIE_B","ADRESSE_PARTIE_B","REPRESENTANT_B"]),
                ],
            },
            {
                "id": "sec-definitions",
                "title_ar": "تعاريف",
                "title_fr": "Définitions",
                "articles": [
                    article("art-info-confidentielle",
                        f"Par « Information Confidentielle », on entend toute information de quelque nature que ce soit, communiquée par la Partie Divulgante à la Partie Réceptrice, notamment : {field_fr('SCOPE_INFOS')}.",
                        f"يقصد بـ « المعلومات السرية » كل معلومة أياً كانت طبيعتها، يبلغها الطرف المفصح للطرف المتلقي، وخاصة: {field_ar('SCOPE_INFOS')}.",
                        ["SCOPE_INFOS"]),
                ],
            },
            {
                "id": "sec-obligations",
                "title_ar": "الالتزامات",
                "title_fr": "Obligations",
                "articles": [
                    article("art-engagement",
                        f"La Partie Réceptrice s'engage à : (a) ne pas divulguer les Informations Confidentielles à des tiers ; (b) ne pas utiliser les Informations Confidentielles à d'autres fins que {field_fr('OBJET_COLLABORATION')} ; (c) prendre toutes les mesures nécessaires pour en préserver la confidentialité.",
                        f"يلتزم الطرف المتلقي بما يلي: (أ) عدم إفشاء المعلومات السرية للغير؛ (ب) عدم استعمال المعلومات السرية لأغراض غير {field_ar('OBJET_COLLABORATION')}؛ (ج) اتخاذ جميع التدابير اللازمة للمحافظة على سريتها.",
                        ["OBJET_COLLABORATION"]),
                    article("art-exceptions",
                        f"Sont exclues du champ de la confidentialité les informations : (a) déjà dans le domaine public ; (b) déjà connues de la Partie Réceptrice avant leur communication ; (c) obtenues de tiers de manière légitime ; (d) dont la divulgation est imposée par la loi.",
                        f"تستثنى من نطاق السرية المعلومات: (أ) التي هي في الملك العمومي؛ (ب) التي يعلم بها الطرف المتلقي قبل إبلاغها له؛ (ج) التي تحصل عليها من الغير بطريقة مشروعة؛ (د) التي يفرض القانون الإفصاح عنها.",
                        []),
                ],
            },
            {
                "id": "sec-duree",
                "title_ar": "المدة",
                "title_fr": "Durée",
                "articles": [
                    article("art-duree-engagement",
                        f"Le présent engagement de confidentialité prend effet à compter du {field_fr('DATE_EFFET')} et reste en vigueur pendant une durée de {field_fr('DUREE_ANNEE')} années à compter de la fin des discussions entre les Parties.",
                        f"يسري التعهد بالسرية ابتداءً من {field_ar('DATE_EFFET')} ويبقى نافذاً لمدة {field_ar('DUREE_ANNEE')} سنوات من تاريخ انتهاء المناقشات بين الطرفين.",
                        ["DATE_EFFET","DUREE_ANNEE"]),
                ],
            },
            {
                "id": "sec-sanctions",
                "title_ar": "الجزاءات",
                "title_fr": "Sanctions",
                "articles": [
                    article("art-dommages",
                        f"Toute violation du présent engagement expose la Partie Réceptrice à des dommages et intérêts, sans préjudice de toute autre action en justice.",
                        f"كل خرق لهذا التعهد يعرض الطرف المتلقي للمطالبة بالتعويض عن الأضرار، مع عدم الإخلال بأي حق آخر في التقاضي.",
                        []),
                ],
            },
            {
                "id": "sec-divers",
                "title_ar": "أحكام ختامية",
                "title_fr": "Dispositions finales",
                "articles": [
                    article("art-restitution",
                        f"À l'issue des discussions ou sur simple demande de la Partie Divulgante, la Partie Réceptrice restituera tous les documents et supports contenant des Informations Confidentielles.",
                        f"عند انتهاء المناقشات أو بمجرد طلب الطرف المفصح، يقوم الطرف المتلقي بإرجاع جميع الوثائق والحوامل المتضمنة معلومات سرية.",
                        []),
                    article("art-juridiction",
                        f"Tout litige sera de la compétence des tribunaux de {field_fr('TRIBUNAL')}.",
                        f"كل نزاع يكون من اختصاص محاكم {field_ar('TRIBUNAL')}.",
                        ["TRIBUNAL"]),
                ],
            },
            {
                "id": "sec-signatures",
                "title_ar": "التوقيع",
                "title_fr": "Signatures",
                "articles": [
                    article("art-date-lieu",
                        f"Fait à {field_fr('LIEU_SIGNATURE')}, le {field_fr('DATE_SIGNATURE')}, en deux exemplaires.",
                        f"حرر بـ {field_ar('LIEU_SIGNATURE')}، بتاريخ {field_ar('DATE_SIGNATURE')}، في نظيرين.",
                        ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
                    article("art-sign-A",
                        f"Partie Divulgante\n{field_fr('REPRESENTANT_A')}",
                        f"الطرف المفصح\n{field_ar('REPRESENTANT_A')}", []),
                    article("art-sign-B",
                        f"Partie Réceptrice\n{field_fr('REPRESENTANT_B')}",
                        f"الطرف المتلقي\n{field_ar('REPRESENTANT_B')}", []),
                ],
            },
        ],
    )


# =====================================================================
# BUILD & SAVE ALL
# =====================================================================
TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)

templates = [
    t1_bail_habitation(),
    t2_reconnaissance_dette(),
    t3_contrat_cdi(),
    t4_statuts_sarl(),
    t5_prestation_services(),
    t6_procuration_speciale(),
    t7_pret_particuliers(),
    t8_nda(),
]

for t in templates:
    path = TEMPLATE_DIR / f"{t['slug']}.json"
    path.write_text(json.dumps(t, ensure_ascii=False, indent=2), encoding='utf-8')
    sections_n = len(t['sections'])
    articles_n = sum(len(s['articles']) for s in t['sections'])
    fields_n = sum(
        len(a['fields']) for s in t['sections'] for a in s['articles']
    )
    print(f"  ✓ {t['slug']:30s}  {sections_n} sections, {articles_n} articles, {fields_n} fields")

print(f"\nSaved {len(templates)} templates to {TEMPLATE_DIR}")
print("\nArabic text is stubs — needs Gemini-assisted translation in Phase 0c.")
