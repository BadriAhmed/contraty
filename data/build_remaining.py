"""
Build templates 14-22: remaining everyday Tunisian contracts.
Then categorize all templates.
"""
import json
from pathlib import Path

DATA_DIR = Path("/home/imari/IdeaProjects/Contraty/data")
TEMPLATE_DIR = DATA_DIR / "templates"

coc = {a["number"]: a["text"] for a in json.loads((DATA_DIR / "raw" / "coc_clean.json").read_text())}
def cocq(n): return coc.get(n, "").replace("** ", "").strip()
def cocqs(nums): return " ".join(cocq(n) for n in nums) if isinstance(nums, list) else cocq(nums)

def build(slug, title_fr, title_ar, cat, legal_basis, sections):
    return {
        "id": f"{slug}-v1", "title_ar": title_ar, "title_fr": title_fr,
        "slug": slug, "language": "both", "category": cat,
        "legal_basis": legal_basis, "version": "1.0",
        "reviewed_by": None, "review_date": None, "source": "public_examples",
        "disclaimer": "Modèle indicatif — non révisé par un avocat. / نموذج إرشادي — لم يراجعه محامٍ.",
        "sections": sections
    }

def art(aid, fr, ar, fields=None):
    return {"id": aid, "text_ar": ar, "text_fr": fr, "fields": fields or []}

F = lambda n: f"[{n}]"

# ═══════════════════════════════════════════════════════
# 14: COMPROMIS DE VENTE IMMOBILIER
# ═══════════════════════════════════════════════════════
t_compromis = build(
    "compromis-vente-immobilier",
    "Compromis de Vente Immobilier",
    "وعد بالبيع العقاري",
    "immobilier",
    "Code des Obligations et des Contrats, articles 564 à 717 (Vente) et Code des Droits Réels",
    sections=[
        {"id": "sec-parties", "title_ar": "الأطراف", "title_fr": "Parties", "articles": [
            art("art-promettant",
                f"M./Mme {F('NOM_VENDEUR')}, CIN n° {F('CIN_VENDEUR')}, état civil : {F('ETAT_CIVIL_VENDEUR')}, demeurant à {F('ADRESSE_VENDEUR')}, ci-après « le Promettant ».",
                f"السيد/ة {F('NOM_VENDEUR')}، ب.ت.و عدد {F('CIN_VENDEUR')}، الحالة المدنية: {F('ETAT_CIVIL_VENDEUR')}، القاطن/ة بـ {F('ADRESSE_VENDEUR')}، يشار إليه/ا بـ « الواعد ».",
                ["NOM_VENDEUR","CIN_VENDEUR","ETAT_CIVIL_VENDEUR","ADRESSE_VENDEUR"]),
            art("art-beneficiaire",
                f"M./Mme {F('NOM_ACQUEREUR')}, CIN n° {F('CIN_ACQUEREUR')}, état civil : {F('ETAT_CIVIL_ACQUEREUR')}, demeurant à {F('ADRESSE_ACQUEREUR')}, ci-après « le Bénéficiaire ».",
                f"السيد/ة {F('NOM_ACQUEREUR')}، ب.ت.و عدد {F('CIN_ACQUEREUR')}، الحالة المدنية: {F('ETAT_CIVIL_ACQUEREUR')}، القاطن/ة بـ {F('ADRESSE_ACQUEREUR')}، يشار إليه/ا بـ « الموعود له ».",
                ["NOM_ACQUEREUR","CIN_ACQUEREUR","ETAT_CIVIL_ACQUEREUR","ADRESSE_ACQUEREUR"]),
        ]},
        {"id": "sec-bien", "title_ar": "العقار", "title_fr": "Désignation du bien", "articles": [
            art("art-bien",
                f"Le Promettant s'engage à vendre au Bénéficiaire, qui s'engage à acquérir, le bien immobilier suivant :\nNature : {F('NATURE')} ({F('NB_PIECES')} pièces)\nAdresse : {F('ADRESSE_BIEN')}\nTitre foncier n° : {F('TITRE_FONCIER')}\nSuperficie : {F('SUPERFICIE')} m²\nOrigine de propriété : {F('ORIGINE_PROPRIETE')}",
                f"يتعهد الواعد ببيع العقار التالي للموعود له الذي يتعهد بشرائه:\nالنوع: {F('NATURE')} ({F('NB_PIECES')} غرف)\nالعنوان: {F('ADRESSE_BIEN')}\nالرسم العقاري عدد: {F('TITRE_FONCIER')}\nالمساحة: {F('SUPERFICIE')} م²\nأصل الملكية: {F('ORIGINE_PROPRIETE')}",
                ["NATURE","NB_PIECES","ADRESSE_BIEN","TITRE_FONCIER","SUPERFICIE","ORIGINE_PROPRIETE"]),
        ]},
        {"id": "sec-prix", "title_ar": "الثمن", "title_fr": "Prix et modalités", "articles": [
            art("art-prix",
                f"Le prix de vente est fixé à {F('PRIX_TOTAL')} dinars tunisiens. Une avance de {F('AVANCE')} DT est versée ce jour à titre d'arrhes. {cocq(580)} Le solde de {F('SOLDE')} DT sera payé à la signature de l'acte définitif.",
                f"حدد ثمن البيع بـ {F('PRIX_TOTAL')} ديناراً تونسياً. يدفع تقدمة قدرها {F('AVANCE')} د.ت هذا اليوم كعربون. يدفع باقي الثمن وقدره {F('SOLDE')} د.ت عند توقيع العقد النهائي.",
                ["PRIX_TOTAL","AVANCE","SOLDE"]),
        ]},
        {"id": "sec-conditions", "title_ar": "الشروط المعلقة", "title_fr": "Conditions suspensives", "articles": [
            art("art-conditions",
                f"La vente définitive est subordonnée à la réalisation des conditions suspensives suivantes :\na) Obtention par le Bénéficiaire d'un prêt bancaire de {F('MONTANT_PRET')} DT avant le {F('DATE_LIMITE_PRET')} ;\nb) Délivrance d'un certificat d'urbanisme favorable ;\nc) Purge du droit de préemption éventuel ;\nd) {F('AUTRES_CONDITIONS')}",
                f"يعلق البيع النهائي على تحقق الشروط التالية:\nأ) حصول الموعود له على قرض بنكي قدره {F('MONTANT_PRET')} د.ت قبل {F('DATE_LIMITE_PRET')}؛\nب) تسليم شهادة تقسيم معماري مواتية؛\nج) إسقاط حق الشفعة عند الاقتضاء؛\nد) {F('AUTRES_CONDITIONS')}",
                ["MONTANT_PRET","DATE_LIMITE_PRET","AUTRES_CONDITIONS"]),
        ]},
        {"id": "sec-delai", "title_ar": "الأجل", "title_fr": "Délai de réalisation", "articles": [
            art("art-delai",
                f"La vente définitive devra être conclue par acte notarié au plus tard le {F('DATE_LIMITE_VENTE')}. A défaut de réalisation des conditions suspensives à cette date, le présent compromis sera caduc de plein droit et l'avance restituée au Bénéficiaire.",
                f"يجب إبرام البيع النهائي بعقد موثق في أجل أقصاه {F('DATE_LIMITE_VENTE')}. إذا لم تتحقق الشروط المعلقة في هذا التاريخ، يصبح الوعد بالبيع لاغياً بقوة القانون وتسترجع التقدمة للموعود له.",
                ["DATE_LIMITE_VENTE"]),
        ]},
        {"id": "sec-documents", "title_ar": "الوثائق", "title_fr": "Documents", "articles": [
            art("art-documents",
                f"Le Promettant s'engage à fournir : certificat de propriété, certificat de situation hypothécaire, certificat de non-inscription au registre du commerce, attestation fiscale, quitus de la municipalité, et tout document nécessaire à la vente définitive.",
                f"يتعهد الواعد بتقديم: شهادة ملكية، شهادة وضعية الرهن العقاري، شهادة عدم القيد بالسجل التجاري، شهادة جبائية، مخالصة بلدية، وكل وثيقة ضرورية لإتمام البيع النهائي.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signatures", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU_SIGNATURE')}, le {F('DATE_SIGNATURE')}, en deux exemplaires.",
                f"حرر بـ {F('LIEU_SIGNATURE')}، بتاريخ {F('DATE_SIGNATURE')}، في نظيرين.",
                ["LIEU_SIGNATURE","DATE_SIGNATURE"]),
            art("art-sign-v", f"Le Promettant\n{F('NOM_VENDEUR')}\n(Lu et approuvé — Bon pour compromis)", f"الواعد\n{F('NOM_VENDEUR')}\n(قرأت وأوافق — صحيح لوعد بالبيع)", []),
            art("art-sign-a", f"Le Bénéficiaire\n{F('NOM_ACQUEREUR')}\n(Lu et approuvé — Bon pour compromis)", f"الموعود له\n{F('NOM_ACQUEREUR')}\n(قرأت وأوافق — صحيح لوعد بالبيع)", []),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 15: ÉTAT DES LIEUX
# ═══════════════════════════════════════════════════════
t_etat_lieux = build(
    "etat-des-lieux",
    "État des Lieux (Entrée / Sortie)",
    "محضر معاينة (دخول / خروج)",
    "immobilier",
    "Code des Obligations et des Contrats, articles 727 à 827 (Louage des choses)",
    sections=[
        {"id": "sec-parties", "title_ar": "الأطراف", "title_fr": "Parties", "articles": [
            art("art-bailleur",
                f"Bailleur : M./Mme {F('NOM_BAILLEUR')}, CIN n° {F('CIN_BAILLEUR')}.",
                f"المكري: السيد/ة {F('NOM_BAILLEUR')}، ب.ت.و عدد {F('CIN_BAILLEUR')}.",
                ["NOM_BAILLEUR","CIN_BAILLEUR"]),
            art("art-preneur",
                f"Preneur : M./Mme {F('NOM_PRENEUR')}, CIN n° {F('CIN_PRENEUR')}.",
                f"المكتري: السيد/ة {F('NOM_PRENEUR')}، ب.ت.و عدد {F('CIN_PRENEUR')}.",
                ["NOM_PRENEUR","CIN_PRENEUR"]),
        ]},
        {"id": "sec-bien", "title_ar": "العقار", "title_fr": "Bien concerné", "articles": [
            art("art-adresse",
                f"Bien situé à {F('ADRESSE_BIEN')}. Type d'état des lieux : {F('TYPE_ETAT')} (Entrée / Sortie).",
                f"العقار الكائن بـ {F('ADRESSE_BIEN')}. نوع المعاينة: {F('TYPE_ETAT')} (دخول / خروج).",
                ["ADRESSE_BIEN","TYPE_ETAT"]),
        ]},
        {"id": "sec-pieces", "title_ar": "معاينة الغرف", "title_fr": "État pièce par pièce", "articles": [
            art("art-salon",
                f"Salon / Séjour : Sols : {F('SOL_SALON')} | Murs : {F('MURS_SALON')} | Plafond : {F('PLAFOND_SALON')} | Fenêtres : {F('FENETRES_SALON')} | Observations : {F('OBS_SALON')}",
                f"غرفة الجلوس: الأرضية: {F('SOL_SALON')} | الجدران: {F('MURS_SALON')} | السقف: {F('PLAFOND_SALON')} | النوافذ: {F('FENETRES_SALON')} | ملاحظات: {F('OBS_SALON')}",
                ["SOL_SALON","MURS_SALON","PLAFOND_SALON","FENETRES_SALON","OBS_SALON"]),
            art("art-chambres",
                f"Chambre(s) ({F('NB_CHAMBRES')}) : Sols : {F('SOL_CHAMBRES')} | Murs : {F('MURS_CHAMBRES')} | Placards : {F('PLACARDS_CHAMBRES')} | Observations : {F('OBS_CHAMBRES')}",
                f"غرفة/غرف النوم ({F('NB_CHAMBRES')}): الأرضية: {F('SOL_CHAMBRES')} | الجدران: {F('MURS_CHAMBRES')} | الخزائن: {F('PLACARDS_CHAMBRES')} | ملاحظات: {F('OBS_CHAMBRES')}",
                ["NB_CHAMBRES","SOL_CHAMBRES","MURS_CHAMBRES","PLACARDS_CHAMBRES","OBS_CHAMBRES"]),
            art("art-cuisine",
                f"Cuisine : Sols : {F('SOL_CUISINE')} | Murs : {F('MURS_CUISINE')} | Évier : {F('EVIER')} | Meubles : {F('MEUBLES_CUISINE')} | Observations : {F('OBS_CUISINE')}",
                f"المطبخ: الأرضية: {F('SOL_CUISINE')} | الجدران: {F('MURS_CUISINE')} | حوض الغسيل: {F('EVIER')} | الأثاث: {F('MEUBLES_CUISINE')} | ملاحظات: {F('OBS_CUISINE')}",
                ["SOL_CUISINE","MURS_CUISINE","EVIER","MEUBLES_CUISINE","OBS_CUISINE"]),
            art("art-sdb",
                f"Salle de bain(s) ({F('NB_SDB')}) : Sols : {F('SOL_SDB')} | Murs : {F('MURS_SDB')} | Sanitaires : {F('SANITAIRES')} | Robinetterie : {F('ROBINETTERIE')} | Observations : {F('OBS_SDB')}",
                f"الحمام/ات ({F('NB_SDB')}): الأرضية: {F('SOL_SDB')} | الجدران: {F('MURS_SDB')} | الأدوات الصحية: {F('SANITAIRES')} | الحنفيات: {F('ROBINETTERIE')} | ملاحظات: {F('OBS_SDB')}",
                ["NB_SDB","SOL_SDB","MURS_SDB","SANITAIRES","ROBINETTERIE","OBS_SDB"]),
            art("art-autres",
                f"Autres pièces ({F('AUTRES_PIECES')}) : {F('DESCRIPTION_AUTRES_PIECES')}",
                f"غرف أخرى ({F('AUTRES_PIECES')}): {F('DESCRIPTION_AUTRES_PIECES')}",
                ["AUTRES_PIECES","DESCRIPTION_AUTRES_PIECES"]),
        ]},
        {"id": "sec-compteurs", "title_ar": "العدادات", "title_fr": "Compteurs et clés", "articles": [
            art("art-compteurs",
                f"Relevés des compteurs :\nÉlectricité : {F('INDEX_ELEC')} — Compteur n° {F('NUM_COMPTEUR_ELEC')}\nEau : {F('INDEX_EAU')} — Compteur n° {F('NUM_COMPTEUR_EAU')}\nGaz : {F('INDEX_GAZ')} — Compteur n° {F('NUM_COMPTEUR_GAZ')}\nNombre de clés remises : {F('NB_CLES')}",
                f"مؤشرات العدادات:\nكهرباء: {F('INDEX_ELEC')} — عداد عدد {F('NUM_COMPTEUR_ELEC')}\nماء: {F('INDEX_EAU')} — عداد عدد {F('NUM_COMPTEUR_EAU')}\nغاز: {F('INDEX_GAZ')} — عداد عدد {F('NUM_COMPTEUR_GAZ')}\nعدد المفاتيح المسلمة: {F('NB_CLES')}",
                ["INDEX_ELEC","NUM_COMPTEUR_ELEC","INDEX_EAU","NUM_COMPTEUR_EAU","INDEX_GAZ","NUM_COMPTEUR_GAZ","NB_CLES"]),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signatures", "articles": [
            art("art-date",
                f"Fait à {F('LIEU')}, le {F('DATE')}.",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.",
                ["LIEU","DATE"]),
            art("art-sign-b", f"Le Bailleur\n{F('NOM_BAILLEUR')}", f"المكري\n{F('NOM_BAILLEUR')}", []),
            art("art-sign-p", f"Le Preneur\n{F('NOM_PRENEUR')}", f"المكتري\n{F('NOM_PRENEUR')}", []),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 16: LETTRE DE DÉMISSION
# ═══════════════════════════════════════════════════════
t_demission = build(
    "lettre-demission",
    "Lettre de Démission",
    "رسالة استقالة",
    "travail",
    "Code du Travail — Rupture du contrat de travail à l'initiative du salarié",
    sections=[
        {"id": "sec-header", "title_ar": "المرسل والمرسل إليه", "title_fr": "Expéditeur / Destinataire", "articles": [
            art("art-exp",
                f"{F('NOM_SALARIE')}\n{F('ADRESSE_SALARIE')}\nTél : {F('TEL_SALARIE')}\nPoste : {F('POSTE')}",
                f"{F('NOM_SALARIE')}\n{F('ADRESSE_SALARIE')}\nالهاتف: {F('TEL_SALARIE')}\nالخطة: {F('POSTE')}",
                ["NOM_SALARIE","ADRESSE_SALARIE","TEL_SALARIE","POSTE"]),
            art("art-dest",
                f"À l'attention de {F('DESTINATAIRE')}\n{F('NOM_ENTREPRISE')}\n{F('ADRESSE_ENTREPRISE')}",
                f"إلى السيد/ة {F('DESTINATAIRE')}\n{F('NOM_ENTREPRISE')}\n{F('ADRESSE_ENTREPRISE')}",
                ["DESTINATAIRE","NOM_ENTREPRISE","ADRESSE_ENTREPRISE"]),
        ]},
        {"id": "sec-objet", "title_ar": "الموضوع", "title_fr": "Objet", "articles": [
            art("art-objet",
                f"Objet : Démission",
                f"الموضوع: استقالة", []),
        ]},
        {"id": "sec-corps", "title_ar": "متن الرسالة", "title_fr": "Corps de la lettre", "articles": [
            art("art-annonce",
                f"Par la présente, je vous informe de ma décision de démissionner de mon poste de {F('POSTE')} au sein de {F('NOM_ENTREPRISE')}, que j'occupe depuis le {F('DATE_EMBAUCHE')}.",
                f"أعلمكم بموجب هذه الرسالة قراري بالاستقالة من خطتي كـ {F('POSTE')} بـ {F('NOM_ENTREPRISE')}، التي أشغلها منذ {F('DATE_EMBAUCHE')}.",
                ["DATE_EMBAUCHE"]),
            art("art-preavis",
                f"Je respecterai le préavis légal de {F('DUREE_PREAVIS')}, qui prendra effet à compter du {F('DATE_EFFET_PREAVIS')}. Mon dernier jour de travail sera donc le {F('DATE_DERNIER_JOUR')}.",
                f"سأحترم أجل الإعلام المسبق القانوني وقدره {F('DUREE_PREAVIS')}، الذي يبدأ سريانه من {F('DATE_EFFET_PREAVIS')}. وبالتالي سيكون آخر يوم عمل لي هو {F('DATE_DERNIER_JOUR')}.",
                ["DUREE_PREAVIS","DATE_EFFET_PREAVIS","DATE_DERNIER_JOUR"]),
            art("art-motif",
                f"(Facultatif) Je quitte l'entreprise pour le motif suivant : {F('MOTIF_DEMISSION')}.",
                f"(اختياري) أغادر المؤسسة للسبب التالي: {F('MOTIF_DEMISSION')}.",
                ["MOTIF_DEMISSION"]),
            art("art-remerciements",
                f"Je vous remercie pour la confiance et les opportunités que vous m'avez accordées durant mon parcours au sein de l'entreprise.",
                f"أشكركم على الثقة والفرص التي منحتموني إياها طيلة مسيرتي داخل المؤسسة.", []),
            art("art-documents",
                f"Je vous saurais gré de bien vouloir me remettre mon certificat de travail, mon solde de tout compte, et l'attestation de cessation d'emploi destinée à la CNSS.",
                f"أرجو التكرم بتسليمي شهادة العمل ووصل المخالصة النهائية وشهادة انتهاء العمل الموجهة للصندوق الوطني للضمان الاجتماعي.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM_SALARIE')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM_SALARIE')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 17: ATTESTATION SUR L'HONNEUR
# ═══════════════════════════════════════════════════════
t_attestation = build(
    "attestation-honneur",
    "Attestation sur l'Honneur",
    "شهادة على الشرف",
    "civil-famille",
    "Code des Obligations et des Contrats — Déclarations unilatérales",
    sections=[
        {"id": "sec-declarant", "title_ar": "هوية المصرح", "title_fr": "Identité du déclarant", "articles": [
            art("art-declarant",
                f"Je soussigné(e), M./Mme {F('NOM')}, né(e) le {F('DATE_NAISSANCE')} à {F('LIEU_NAISSANCE')}, de nationalité {F('NATIONALITE')}, CIN n° {F('CIN')}, délivrée le {F('DATE_CIN')}, demeurant à {F('ADRESSE')}, exerçant la profession de {F('PROFESSION')}.",
                f"أنا الممضي أسفله، السيد/ة {F('NOM')}، مولود/ة بتاريخ {F('DATE_NAISSANCE')} بـ {F('LIEU_NAISSANCE')}، {F('NATIONALITE')} الجنسية، ب.ت.و عدد {F('CIN')}، المسلمة بتاريخ {F('DATE_CIN')}، القاطن/ة بـ {F('ADRESSE')}، والمزاول/ة لمهنة {F('PROFESSION')}.",
                ["NOM","DATE_NAISSANCE","LIEU_NAISSANCE","NATIONALITE","CIN","DATE_CIN","ADRESSE","PROFESSION"]),
        ]},
        {"id": "sec-declaration", "title_ar": "التصريح", "title_fr": "Déclaration", "articles": [
            art("art-texte",
                f"Atteste sur l'honneur que : {F('DECLARATION')}.",
                f"أشهد على شرفي بأن: {F('DECLARATION')}.",
                ["DECLARATION"]),
        ]},
        {"id": "sec-objet", "title_ar": "الغرض", "title_fr": "Objet", "articles": [
            art("art-destination",
                f"La présente attestation est délivrée pour servir et valoir ce que de droit, notamment auprès de : {F('DESTINATION')}.",
                f"تسلم هذه الشهادة لتقديمها لمن يهمه الأمر، وخاصة لدى: {F('DESTINATION')}.",
                ["DESTINATION"]),
            art("art-sanction",
                f"Je suis informé(e) que toute fausse déclaration m'expose aux sanctions prévues par le Code Pénal.",
                f"أعلم بأن كل تصريح مخالف للحقيقة يعرضني للعقوبات المنصوص عليها بالقانون الجزائي.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 18: MISE EN DEMEURE
# ═══════════════════════════════════════════════════════
t_mise_demeure = build(
    "mise-en-demeure",
    "Mise en Demeure",
    "إنذار قانوني",
    "civil-famille",
    "Code des Obligations et des Contrats, articles 226 à 360 (Extinction des obligations)",
    sections=[
        {"id": "sec-expediteur", "title_ar": "المرسل", "title_fr": "Expéditeur", "articles": [
            art("art-exp",
                f"Je soussigné(e), M./Mme {F('NOM_EXPEDITEUR')}, CIN n° {F('CIN_EXPEDITEUR')}, demeurant à {F('ADRESSE_EXPEDITEUR')}.",
                f"أنا الممضي أسفله، السيد/ة {F('NOM_EXPEDITEUR')}، ب.ت.و عدد {F('CIN_EXPEDITEUR')}، القاطن/ة بـ {F('ADRESSE_EXPEDITEUR')}.",
                ["NOM_EXPEDITEUR","CIN_EXPEDITEUR","ADRESSE_EXPEDITEUR"]),
        ]},
        {"id": "sec-destinataire", "title_ar": "المرسل إليه", "title_fr": "Destinataire", "articles": [
            art("art-dest",
                f"À M./Mme {F('NOM_DESTINATAIRE')}, CIN n° {F('CIN_DESTINATAIRE')}, demeurant à {F('ADRESSE_DESTINATAIRE')}, ou à la société {F('SOCIETE_DESTINATAIRE')}.",
                f"إلى السيد/ة {F('NOM_DESTINATAIRE')}، ب.ت.و عدد {F('CIN_DESTINATAIRE')}، القاطن/ة بـ {F('ADRESSE_DESTINATAIRE')}، أو إلى شركة {F('SOCIETE_DESTINATAIRE')}.",
                ["NOM_DESTINATAIRE","CIN_DESTINATAIRE","ADRESSE_DESTINATAIRE","SOCIETE_DESTINATAIRE"]),
        ]},
        {"id": "sec-objet", "title_ar": "الموضوع", "title_fr": "Objet", "articles": [
            art("art-objet",
                f"Objet : Mise en demeure — {F('OBJET_SOMMAIRE')}",
                f"الموضوع: إنذار — {F('OBJET_SOMMAIRE')}",
                ["OBJET_SOMMAIRE"]),
        ]},
        {"id": "sec-corps", "title_ar": "المتن", "title_fr": "Corps", "articles": [
            art("art-rappel",
                f"Par {F('ACTE_ORIGINE')} en date du {F('DATE_ACTE_ORIGINE')}, vous vous êtes engagé(e) à : {F('OBLIGATION_INITIALE')}.",
                f"بموجب {F('ACTE_ORIGINE')} المؤرخ في {F('DATE_ACTE_ORIGINE')}، التزمتم بـ: {F('OBLIGATION_INITIALE')}.",
                ["ACTE_ORIGINE","DATE_ACTE_ORIGINE","OBLIGATION_INITIALE"]),
            art("art-manquement",
                f"Or, à ce jour, vous n'avez pas exécuté votre obligation, en ce que : {F('MANQUEMENT_CONSTATE')}. {cocqs([226, 227, 228])}",
                f"غير أنكم إلى هذا التاريخ لم تنفذوا التزامكم، حيث أن: {F('MANQUEMENT_CONSTATE')}.",
                ["MANQUEMENT_CONSTATE"]),
            art("art-sommation",
                f"Par la présente, je vous mets en demeure de : {F('SOMMATION')}, dans un délai de {F('DELAI_JOURS')} jours à compter de la réception des présentes.",
                f"بموجب هذا الإنذار، أطلب منكم: {F('SOMMATION')}، وذلك في أجل {F('DELAI_JOURS')} يوماً من تاريخ توصلكم بهذا الإنذار.",
                ["SOMMATION","DELAI_JOURS"]),
            art("art-menace",
                f"À défaut d'exécution dans le délai imparti, je me réserve le droit d'engager toutes les procédures judiciaires nécessaires, sans autre avertissement, pour la sauvegarde de mes droits, et à vos frais.",
                f"في حالة عدم التنفيذ داخل الأجل المحدد، أحتفظ بحقي في مباشرة جميع الإجراءات القضائية اللازمة دون سابق إعلام للمحافظة على حقوقي وعلى نفقتكم.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM_EXPEDITEUR')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM_EXPEDITEUR')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 19: AUTORISATION PARENTALE DE VOYAGE
# ═══════════════════════════════════════════════════════
t_voyage = build(
    "autorisation-parentale-voyage",
    "Autorisation Parentale de Voyage",
    "إذن سفر للقاصر",
    "civil-famille",
    "Code du Statut Personnel — Autorité parentale et Code de la Nationalité Tunisienne",
    sections=[
        {"id": "sec-parent", "title_ar": "الولي", "title_fr": "Parent / Tuteur", "articles": [
            art("art-parent",
                f"Je soussigné(e), M./Mme {F('NOM_PARENT')}, CIN n° {F('CIN_PARENT')}, demeurant à {F('ADRESSE_PARENT')}, agissant en qualité de {F('QUALITE')} (père / mère / tuteur légal) de l'enfant mineur désigné ci-dessous.",
                f"أنا الممضي أسفله، السيد/ة {F('NOM_PARENT')}، ب.ت.و عدد {F('CIN_PARENT')}، القاطن/ة بـ {F('ADRESSE_PARENT')}، بصفتي {F('QUALITE')} (أب / أم / ولي شرعي) للطفل القاصر المذكور أسفله.",
                ["NOM_PARENT","CIN_PARENT","ADRESSE_PARENT","QUALITE"]),
        ]},
        {"id": "sec-enfant", "title_ar": "الطفل", "title_fr": "Enfant", "articles": [
            art("art-enfant",
                f"Nom et prénom : {F('NOM_ENFANT')}\nNé(e) le : {F('DATE_NAISSANCE_ENFANT')} à {F('LIEU_NAISSANCE_ENFANT')}\nN° extrait de naissance : {F('NUM_EXTRAIT_NAISSANCE')}\nNationalité : Tunisienne\nPasseport / CIN n° : {F('NUM_PIECE_ENFANT')}",
                f"الاسم واللقب: {F('NOM_ENFANT')}\nتاريخ الولادة: {F('DATE_NAISSANCE_ENFANT')} بـ {F('LIEU_NAISSANCE_ENFANT')}\nعدد مضمون الولادة: {F('NUM_EXTRAIT_NAISSANCE')}\nالجنسية: تونسية\nجواز سفر / ب.ت.و عدد: {F('NUM_PIECE_ENFANT')}",
                ["NOM_ENFANT","DATE_NAISSANCE_ENFANT","LIEU_NAISSANCE_ENFANT","NUM_EXTRAIT_NAISSANCE","NUM_PIECE_ENFANT"]),
        ]},
        {"id": "sec-autorisation", "title_ar": "الإذن", "title_fr": "Autorisation", "articles": [
            art("art-autorisation",
                f"J'autorise mon enfant à voyager à destination de {F('DESTINATION')}, accompagné(e) de M./Mme {F('NOM_ACCOMPAGNATEUR')}, CIN n° {F('CIN_ACCOMPAGNATEUR')}, du {F('DATE_DEPART')} au {F('DATE_RETOUR')}.",
                f"آذن لابني/لابنتي بالسفر إلى {F('DESTINATION')}، مرفوقاً/ة بالسيد/ة {F('NOM_ACCOMPAGNATEUR')}، ب.ت.و عدد {F('CIN_ACCOMPAGNATEUR')}، من {F('DATE_DEPART')} إلى {F('DATE_RETOUR')}.",
                ["DESTINATION","NOM_ACCOMPAGNATEUR","CIN_ACCOMPAGNATEUR","DATE_DEPART","DATE_RETOUR"]),
        ]},
        {"id": "sec-engagement", "title_ar": "التعهد", "title_fr": "Engagement", "articles": [
            art("art-engagement",
                f"Je dégage toute responsabilité des autorités pour la durée du voyage. La présente autorisation est délivrée sur papier libre et peut être légalisée à la mairie ou au commissariat.",
                f"أعفي السلطات من كل مسؤولية طيلة مدة السفر. يسلم هذا الإذن على ورق عادي ويمكن التصديق عليه لدى البلدية أو مركز الأمن.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM_PARENT')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM_PARENT')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 20: RUPTURE CONVENTIONNELLE CDI
# ═══════════════════════════════════════════════════════
t_rupture = build(
    "rupture-conventionnelle",
    "Rupture Conventionnelle du Contrat de Travail (CDI)",
    "اتفاقية إنهاء علاقة الشغل",
    "travail",
    "Code du Travail — Rupture conventionnelle du contrat à durée indéterminée",
    sections=[
        {"id": "sec-parties", "title_ar": "الأطراف", "title_fr": "Parties", "articles": [
            art("art-employeur",
                f"La société {F('NOM_ENTREPRISE')}, RNE n° {F('RNE')}, sise {F('ADRESSE_ENTREPRISE')}, représentée par {F('REPRESENTANT')}, ci-après « l'Employeur ».",
                f"شركة {F('NOM_ENTREPRISE')}، س.و.م عدد {F('RNE')}، الكائنة بـ {F('ADRESSE_ENTREPRISE')}، يمثلها {F('REPRESENTANT')}، يشار إليها بـ « المؤجر ».",
                ["NOM_ENTREPRISE","RNE","ADRESSE_ENTREPRISE","REPRESENTANT"]),
            art("art-salarie",
                f"M./Mme {F('NOM_SALARIE')}, CIN n° {F('CIN_SALARIE')}, engagé(e) par CDI du {F('DATE_CDI')} en qualité de {F('POSTE')}, ci-après « le Salarié ».",
                f"السيد/ة {F('NOM_SALARIE')}، ب.ت.و عدد {F('CIN_SALARIE')}، انتدب/ت بعقد غير محدد المدة بتاريخ {F('DATE_CDI')} بصفة {F('POSTE')}، يشار إليه/ا بـ « الأجير ».",
                ["NOM_SALARIE","CIN_SALARIE","DATE_CDI","POSTE"]),
        ]},
        {"id": "sec-accord", "title_ar": "الاتفاق", "title_fr": "Accord", "articles": [
            art("art-accord",
                f"Les parties conviennent d'un commun accord de rompre le contrat de travail à durée indéterminée qui les lie. La rupture prendra effet le {F('DATE_RUPTURE')}.",
                f"يتفق الطرفان بالتراضي على إنهاء علاقة الشغل غير محددة المدة التي تربطهما. يسري إنهاء العلاقة الشغلية ابتداءً من {F('DATE_RUPTURE')}.",
                ["DATE_RUPTURE"]),
        ]},
        {"id": "sec-indemnite", "title_ar": "التعويضات", "title_fr": "Indemnités", "articles": [
            art("art-indemnite",
                f"Le Salarié percevra une indemnité de rupture conventionnelle d'un montant de {F('INDEMNITE')} DT, calculée sur la base de {F('BASE_CALCUL')}, en sus de son solde de tout compte comprenant : salaire dû jusqu'à la date de rupture, indemnité compensatrice de congés payés ({F('JOURS_CONGES_DUS')} jours), et toute autre somme due.",
                f"يتقاضى الأجير منحة إنهاء بالتراضي قدرها {F('INDEMNITE')} د.ت، محسوبة على أساس {F('BASE_CALCUL')}، إضافة إلى مخالصته النهائية التي تشمل: الأجر المستحق إلى تاريخ الإنهاء، والتعويض عن أيام الراحة غير المستخلصة ({F('JOURS_CONGES_DUS')} يوم)، وكل مبلغ آخر مستحق.",
                ["INDEMNITE","BASE_CALCUL","JOURS_CONGES_DUS"]),
        ]},
        {"id": "sec-renonciation", "title_ar": "الإبراء", "title_fr": "Renonciation", "articles": [
            art("art-renonciation",
                f"Le Salarié déclare être rempli de l'intégralité de ses droits et renonce à toute réclamation ou action judiciaire relative à l'exécution ou à la rupture du contrat de travail.",
                f"يصرح الأجير بأنه استوفى كامل حقوقه ويتنازل عن كل مطالبة أو دعوى قضائية تتعلق بتنفيذ أو إنهاء عقد الشغل.", []),
        ]},
        {"id": "sec-documents", "title_ar": "الوثائق", "title_fr": "Documents", "articles": [
            art("art-documents",
                f"L'Employeur remet au Salarié : le certificat de travail, l'attestation de cessation d'emploi (CNSS), et le reçu pour solde de tout compte.",
                f"يسلم المؤجر للأجير: شهادة العمل، وشهادة انتهاء العمل (للصندوق الوطني للضمان الاجتماعي)، ووصل مخالصة نهائية.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signatures", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}, en deux exemplaires.",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}، في نظيرين.",
                ["LIEU","DATE"]),
            art("art-sign-e", f"L'Employeur\n{F('REPRESENTANT')}", f"المؤجر\n{F('REPRESENTANT')}", []),
            art("art-sign-s", f"Le Salarié\n{F('NOM_SALARIE')}\n(Lu et approuvé — Bon pour accord)", f"الأجير\n{F('NOM_SALARIE')}\n(قرأت وأوافق — صحيح للاتفاق)", []),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 21: ATTESTATION D'HÉBERGEMENT
# ═══════════════════════════════════════════════════════
t_hebergement = build(
    "attestation-hebergement",
    "Attestation d'Hébergement",
    "شهادة إيواء",
    "civil-famille",
    "Déclaration unilatérale — usage administratif (carte de séjour, CNSS, inscription scolaire)",
    sections=[
        {"id": "sec-hebergeant", "title_ar": "المؤوي", "title_fr": "Hébergeant", "articles": [
            art("art-hebergeant",
                f"Je soussigné(e), M./Mme {F('NOM_HEBERGEANT')}, CIN n° {F('CIN_HEBERGEANT')}, demeurant à {F('ADRESSE_HEBERGEANT')}.",
                f"أنا الممضي أسفله، السيد/ة {F('NOM_HEBERGEANT')}، ب.ت.و عدد {F('CIN_HEBERGEANT')}، القاطن/ة بـ {F('ADRESSE_HEBERGEANT')}.",
                ["NOM_HEBERGEANT","CIN_HEBERGEANT","ADRESSE_HEBERGEANT"]),
        ]},
        {"id": "sec-declaration", "title_ar": "التصريح", "title_fr": "Déclaration", "articles": [
            art("art-declaration",
                f"Atteste héberger à mon domicile sis {F('ADRESSE_HEBERGEMENT')}, à titre gratuit, M./Mme {F('NOM_HEBERGE')}, CIN n° {F('CIN_HEBERGE')}, depuis le {F('DATE_DEBUT_HEBERGEMENT')}.",
                f"أشهد بأني أوي بمقر سكني الكائن بـ {F('ADRESSE_HEBERGEMENT')}، بصفة مجانية، السيد/ة {F('NOM_HEBERGE')}، ب.ت.و عدد {F('CIN_HEBERGE')}، وذلك منذ {F('DATE_DEBUT_HEBERGEMENT')}.",
                ["ADRESSE_HEBERGEMENT","NOM_HEBERGE","CIN_HEBERGE","DATE_DEBUT_HEBERGEMENT"]),
            art("art-lien",
                f"Lien avec l'hébergé(e) : {F('LIEN')} (conjoint, ascendant, descendant, collatéral, ami, etc.).",
                f"صلة القرابة بالمؤوى: {F('LIEN')} (زوج/ة، أصل، فرع، حاشية، صديق/ة، إلخ).",
                ["LIEN"]),
        ]},
        {"id": "sec-destination", "title_ar": "الغرض", "title_fr": "Objet", "articles": [
            art("art-destination",
                f"La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit, notamment auprès de : {F('DESTINATION')}.",
                f"تسلم هذه الشهادة للمعني/ة بالأمر لتقديمها لمن يهمه الأمر وخاصة لدى: {F('DESTINATION')}.",
                ["DESTINATION"]),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date-lieu",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM_HEBERGEANT')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM_HEBERGEANT')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ═══════════════════════════════════════════════════════
# 22: QUITTANCE DE LOYER
# ═══════════════════════════════════════════════════════
t_quittance = build(
    "quittance-loyer",
    "Quittance de Loyer",
    "وصل كراء",
    "immobilier",
    "Code des Obligations et des Contrats, articles 727 à 827 (Louage)",
    sections=[
        {"id": "sec-parties", "title_ar": "الأطراف", "title_fr": "Parties", "articles": [
            art("art-bailleur",
                f"Je soussigné(e), M./Mme {F('NOM_BAILLEUR')}, CIN n° {F('CIN_BAILLEUR')}, Bailleur, reconnaît avoir reçu de M./Mme {F('NOM_PRENEUR')}, Preneur.",
                f"أنا الممضي أسفله، السيد/ة {F('NOM_BAILLEUR')}، ب.ت.و عدد {F('CIN_BAILLEUR')}، المكري، أشهد بأني تسلمت من السيد/ة {F('NOM_PRENEUR')}، المكتري.",
                ["NOM_BAILLEUR","CIN_BAILLEUR","NOM_PRENEUR"]),
        ]},
        {"id": "sec-paiement", "title_ar": "الدفع", "title_fr": "Paiement", "articles": [
            art("art-paiement",
                f"La somme de {F('MONTANT')} dinars tunisiens, correspondant au loyer du mois de {F('MOIS')} {F('ANNEE')}, pour le bien sis à {F('ADRESSE_BIEN')}. Mode de paiement : {F('MODE_PAIEMENT')}.",
                f"مبلغ {F('MONTANT')} ديناراً تونسياً، مقابل معين كراء شهر {F('MOIS')} {F('ANNEE')}، للعقار الكائن بـ {F('ADRESSE_BIEN')}. طريقة الدفع: {F('MODE_PAIEMENT')}.",
                ["MONTANT","MOIS","ANNEE","ADRESSE_BIEN","MODE_PAIEMENT"]),
        ]},
        {"id": "sec-decharge", "title_ar": "الإبراء", "title_fr": "Décharge", "articles": [
            art("art-decharge",
                f"Le Bailleur déclare être rempli de ses droits pour le mois concerné et donne quittance au Preneur.",
                f"يصرح المكري باستيفاء حقوقه عن الشهر المعني ويسلم وصلاً للمكتري.", []),
        ]},
        {"id": "sec-signatures", "title_ar": "التوقيع", "title_fr": "Signature", "articles": [
            art("art-date",
                f"Fait à {F('LIEU')}, le {F('DATE')}.\n\n{F('NOM_BAILLEUR')}\n(Signature)",
                f"حرر بـ {F('LIEU')}، بتاريخ {F('DATE')}.\n\n{F('NOM_BAILLEUR')}\n(إمضاء)",
                ["LIEU","DATE"]),
        ]},
    ]
)

# ══════ SAVE ALL ══════
templates = [
    ("compromis-vente-immobilier", t_compromis),
    ("etat-des-lieux", t_etat_lieux),
    ("lettre-demission", t_demission),
    ("attestation-honneur", t_attestation),
    ("mise-en-demeure", t_mise_demeure),
    ("autorisation-parentale-voyage", t_voyage),
    ("rupture-conventionnelle", t_rupture),
    ("attestation-hebergement", t_hebergement),
    ("quittance-loyer", t_quittance),
]

for slug, t in templates:
    path = TEMPLATE_DIR / f"{slug}.json"
    path.write_text(json.dumps(t, ensure_ascii=False, indent=2), encoding='utf-8')
    secs = len(t["sections"])
    arts = sum(len(s["articles"]) for s in t["sections"])
    flds = sum(len(a["fields"]) for s in t["sections"] for a in s["articles"])
    print(f"  ✓ {slug:35s}  {secs} sec  {arts:2d} art  {flds:2d} fld  |  {t['category']}")

print("\nDone.")
PYEOF