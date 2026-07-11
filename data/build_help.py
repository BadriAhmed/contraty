#!/usr/bin/env python3
"""Generate contextual help_ar/help_fr for all fields, using section context.

Unlike the pattern-based approach, this understands WHO each field belongs to
(bailleur vs preneur, employeur vs salarié, créancier vs débiteur, etc.)
based on the section the field appears in.
"""

import json
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "data" / "templates"

# Contract-type-specific field hints — overrides generic help for a given slug
# Format: slug → { field_name: (help_fr, help_ar) }
SLUG_HINTS = {
    "lettre-demission": {
        "NOM_SALARIE": ("Votre nom complet — le salarié qui présente sa démission.", "اسمك الكامل — الأجير الذي يقدم استقالته."),
        "ADRESSE_SALARIE": ("Votre adresse personnelle actuelle.", "عنوانك الشخصي الحالي."),
        "TEL_SALARIE": ("Votre numéro de téléphone pour vous joindre si nécessaire.", "رقم هاتفك للاتصال بك عند الحاجة."),
        "POSTE": ("Le poste que vous occupez actuellement dans l'entreprise.", "المنصب الذي تشغله حاليًا في المؤسسة."),
        "DATE_DERNIER_JOUR": ("Date de votre dernier jour de travail (après la période de préavis).", "تاريخ آخر يوم عمل لك (بعد انتهاء مهلة الإعلام المسبق)."),
        "DATE_EFFET_PREAVIS": ("Date à partir de laquelle le préavis commence à courir.", "التاريخ الذي يبدأ منه سريان مهلة الإعلام المسبق."),
        "DATE": ("Date à laquelle vous rédigez cette lettre de démission.", "تاريخ تحرير رسالة الاستقالة."),
        "LIEU": ("Lieu (ville) où vous rédigez cette lettre.", "المكان (المدينة) الذي تحرر فيه هذه الرسالة."),
        "DESTINATAIRE": ("Nom du responsable ou du service RH à qui vous adressez cette lettre.", "اسم المسؤول أو مصلحة الموارد البشرية الموجه إليها هذه الرسالة."),
        "NOM_ENTREPRISE": ("Nom de l'entreprise que vous quittez.", "اسم المؤسسة التي تغادرها."),
        "DUREE_PREAVIS": ("Durée du préavis que vous respectez avant votre départ.", "مدة الإعلام المسبق التي تحترمها قبل مغادرتك."),
        "DATE_EMBAUCHE": ("Date à laquelle vous avez été embauché(e) dans cette entreprise.", "تاريخ انتدابك في هذه المؤسسة."),
        "MOTIF_DEMISSION": ("Raison de votre départ (optionnel, peut rester général).", "سبب مغادرتك (اختياري، يمكن أن يكون عامًا)."),
    },
    "rupture-conventionnelle": {
        "NOM_SALARIE": ("Nom complet du salarié concerné par la rupture conventionnelle.", "الاسم الكامل للأجير المعني بالإنهاء الاتفاقي للعقد."),
        "CIN_SALARIE": ("Numéro CIN du salarié concerné par la rupture.", "رقم بطاقة تعريف الأجير المعني بالإنهاء."),
        "ADRESSE_SALARIE": ("Adresse du salarié concerné.", "عنوان الأجير المعني."),
        "NOM_ENTREPRISE": ("Nom de l'employeur qui accepte la rupture conventionnelle.", "اسم المشغل الذي يقبل الإنهاء الاتفاقي."),
    },
    "contrat-sivp": {
        "NOM_STAGIAIRE": ("Nom complet du stagiaire SIVP.", "الاسم الكامل للمتربص في إطار صيغ."),
        "CIN_STAGIAIRE": ("Numéro CIN du stagiaire SIVP.", "رقم بطاقة تعريف المتربص."),
        "ADRESSE_STAGIAIRE": ("Adresse du stagiaire.", "عنوان المتربص."),
        "NOM_ENTREPRISE": ("Nom de l'entreprise d'accueil du stage SIVP.", "اسم المؤسسة المستضيفة للتربص."),
        "DATE_DEBUT": ("Date de début du stage SIVP.", "تاريخ بداية التربص."),
        "MONTANT_BOURSE": ("Montant de la bourse mensuelle en dinars tunisiens.", "مبلغ المنحة الشهرية بالدينار التونسي."),
        "PART_ETAT": ("Part de la bourse prise en charge par l'État (%).", "نسبة المنحة التي تتحملها الدولة (%)."),
        "PART_ENTREPRISE": ("Part de la bourse prise en charge par l'entreprise (%).", "نسبة المنحة التي تتحملها المؤسسة (%)."),
    },
    "contrat-karama": {
        "NOM_SALARIE": ("Nom complet du bénéficiaire du programme Karama.", "الاسم الكامل للمنتفع ببرنامج كرامة."),
        "CIN_SALARIE": ("Numéro CIN du bénéficiaire.", "رقم بطاقة تعريف المنتفع."),
        "ADRESSE_SALARIE": ("Adresse du bénéficiaire.", "عنوان المنتفع."),
        "NOM_ENTREPRISE": ("Nom de l'entreprise qui recrute via le programme Karama.", "اسم المؤسسة المنتدبة في إطار برنامج كرامة."),
    },
    "contrat-cdd": {
        "NOM_SALARIE": ("Nom complet du salarié recruté pour la mission à durée déterminée.", "الاسم الكامل للأجير المنتدب للمهمة محددة المدة."),
        "CIN_SALARIE": ("Numéro CIN du salarié en CDD.", "رقم بطاقة تعريف الأجير بعقد محدد المدة."),
        "DUREE": ("Durée totale de la mission (ex: 6 mois, 1 an).", "المدة الكاملة للمهمة (مثال: 6 أشهر، سنة)."),
        "DATE_FIN": ("Date de fin prévue de la mission.", "التاريخ المتوقع لنهاية المهمة."),
    },
    "prestation-services": {
        "NOM_PRESTATAIRE": ("Nom de la personne ou entreprise qui réalise la prestation.", "اسم الشخص أو المؤسسة التي تنجز الخدمة."),
        "NOM_CLIENT": ("Nom du client qui commande la prestation.", "اسم الحريف الذي يطلب الخدمة."),
    },
    "pret-particuliers": {
        "NOM_EMPRUNTEUR": ("Nom complet de la personne qui emprunte l'argent.", "الاسم الكامل للشخص الذي يقترض المال."),
        "NOM_PRETEUR": ("Nom complet de la personne qui prête l'argent.", "الاسم الكامل للشخص الذي يقرض المال."),
        "MONTANT": ("Montant total du prêt en dinars tunisiens.", "المبلغ الكامل للقرض بالدينار التونسي."),
    },
}

# Extra field hints for ambiguous fields across all templates
EXTRA_FIELD_HINTS = {
    "RNE": ("Numéro unique du Registre National des Entreprises.", "الرقم الموحد للسجل الوطني للمؤسسات."),
    "JOUR_PAIE": ("Jour du mois où le salaire est versé (ex: 28).", "اليوم من الشهر الذي يدفع فيه الأجر (مثال: 28)."),
    "JOUR_PAIEMENT": ("Jour du mois où le loyer doit être payé (ex: le 5).", "اليوم من الشهر الذي يدفع فيه الكراء (مثال: 5)."),
    "CHARGES_INCLUSES": ("Charges payées par le propriétaire et incluses dans le loyer (eau, électricité, etc.).", "المصاريف التي يدفعها المالك وهي مشمولة في الكراء (ماء، كهرباء...)."),
    "CHARGES_PRENEUR": ("Charges à la charge du locataire, en plus du loyer.", "المصاريف على عاتق المكتري، إضافة إلى الكراء."),
    "HEURES_SEMAINE": ("Nombre d'heures de travail par semaine (ex: 40).", "عدد ساعات العمل في الأسبوع (مثال: 40)."),
    "HORAIRES": ("Horaires quotidiens de travail (ex: 8h-17h).", "أوقات العمل اليومية (مثال: 8ص-5م)."),
    "JOURS_CONGES": ("Nombre de jours de congés payés par an (ex: 30).", "عدد أيام الراحة مدفوعة الأجر في السنة (مثال: 30)."),
    "AVANTAGES": ("Avantages en nature ou primes (ex: voiture de fonction, 13e mois).", "الامتيازات العينية أو المنح (مثال: سيارة وظيفية، الشهر 13)."),
    "CLASSIFICATION": ("Classification professionnelle selon la convention collective (ex: cadre, agent de maîtrise).", "التصنيف المهني حسب الاتفاقية المشتركة (مثال: إطار، عميل تنفيذ)."),
    "MOTIF_CDD": ("Raison justifiant le recours à un contrat à durée déterminée (ex: remplacement, surcroît d'activité).", "السبب المبرر للالتجاء إلى عقد محدد المدة (مثال: تعويض، ذروة نشاط)."),
    "DIPLOME": ("Diplôme obtenu (ex: Licence en informatique).", "الشهادة المتحصل عليها (مثال: إجازة في الإعلامية)."),
    "DOMAINE": ("Domaine d'études ou de spécialité.", "مجال الدراسة أو الاختصاص."),
    "MOIS": ("Mois concerné (ex: janvier, février).", "الشهر المعني (مثال: جانفي، فيفري)."),
    "TYPE_ETAT": ("Précisez s'il s'agit d'un état des lieux d'entrée ou de sortie.", "حدد ما إذا كان محضر معاينة دخول أو خروج."),
    "TRIBUNAL": ("Tribunal territorialement compétent en cas de litige (ex: Tribunal de Tunis).", "المحكمة المختصة ترابيًا في حالة النزاع (مثال: المحكمة الابتدائية بتونس)."),
    "OBJET_SOCIAL": ("Activité principale de la société (ex: commerce de gros, services informatiques).", "النشاط الرئيسي للشركة (مثال: تجارة الجملة، خدمات إعلامية)."),
    "NB_PARTS": ("Nombre total de parts sociales de la SARL.", "العدد الكلي للحصص الاجتماعية للشركة."),
    "REPARTITION_PARTS": ("Comment sont réparties les parts entre les associés (ex: 50/50).", "كيفية توزيع الحصص بين الشركاء (مثال: 50/50)."),
    "MODALITES_REMBOURSEMENT": ("Comment la dette sera remboursée (ex: mensuellement, en une fois).", "كيفية سداد الدين (مثال: شهريًا، دفعة واحدة)."),
    "TAUX_INTERET": ("Taux d'intérêt annuel en pourcentage (ex: 5 pour 5%).", "نسبة الفائدة السنوية (مثال: 5 تعني 5%)."),
    "AVEC_INTERET": ("Indiquez si le prêt comporte des intérêts (oui/non).", "حدد ما إذا كان القرض بفائدة (نعم/لا)."),
    "DESTINATION_PRET": ("Usage prévu pour l'argent emprunté (ex: achat véhicule, travaux).", "الغرض من القرض (مثال: شراء عربة، أشغال)."),
    "GARANTIES_PRET": ("Garanties offertes pour le prêt (ex: caution solidaire, nantissement).", "الضمانات المقدمة للقرض (مثال: كفالة تضامنية، رهن)."),
    "TITRE_FONCIER": ("Numéro du titre foncier du bien immobilier.", "رقم الرسم العقاري للعقار."),
    "SUPERFICIE": ("Surface du bien en mètres carrés.", "مساحة العقار بالمتر المربع."),
    "ORIGINE_PROPRIETE": ("Comment le vendeur a acquis le bien (ex: achat, héritage).", "كيف تحصل البائع على العقار (مثال: شراء، إرث)."),
    "NATURE": ("Nature du bien (ex: appartement, villa, terrain).", "طبيعة العقار (مثال: شقة، فيلا، أرض)."),
    "MODE_PAIEMENT": ("Mode de paiement du loyer (ex: espèces, chèque, virement).", "طريقة دفع الكراء (مثال: نقدًا، صك، تحويل)."),
    "INDEMNITE": ("Montant de l'indemnité de rupture en dinars tunisiens.", "مبلغ تعويض الإنهاء بالدينار التونسي."),
    "BASE_CALCUL": ("Base de calcul de l'indemnité (ex: salaire brut mensuel × années d'ancienneté).", "أساس احتساب التعويض (مثال: الأجر الخام الشهري × سنوات الأقدمية)."),
    "NUM_DEMANDEUR": ("Numéro d'identification du demandeur d'emploi (carte ANETI).", "رقم تعريف طالب الشغل (بطاقة الوكالة الوطنية للتشغيل)."),
    "SUBVENTION_ETAT": ("Montant de la subvention versée par l'État (programme Karama).", "مبلغ الإعانة التي تدفعها الدولة (برنامج كرامة)."),
    "COMPLEMENT_ENTREPRISE": ("Complément de salaire payé par l'entreprise.", "تكملة الأجر التي تدفعها المؤسسة."),
    "SCOPE_INFOS": ("Type d'informations couvertes par la confidentialité (ex: données clients, code source).", "نوع المعلومات المشمولة بالسرية (مثال: بيانات حرفاء، شفرة مصدر)."),
    "OBJET_COLLABORATION": ("But de la collaboration entre les parties.", "هدف التعاون بين الأطراف."),
    "MODALITES_PAIEMENT": ("Comment et quand le paiement sera effectué (ex: 50% à la signature, 50% à la livraison).", "كيف ومتى يتم الدفع (مثال: 50% عند التوقيع، 50% عند التسليم)."),
    "LIEN": ("Adresse internet (URL) du document ou du site de référence.", "رابط الإنترنت للمرجع أو الوثيقة."),
    "DESTINATION": ("But ou usage prévu pour ce document.", "الغرض أو الاستعمال المقصود لهذه الوثيقة."),
    "NATIONALITE": ("Nationalité de la personne concernée (ex: Tunisienne).", "جنسية الشخص المعني (مثال: تونسية)."),
    "PROFESSION": ("Profession ou métier de la personne concernée.", "مهنة أو حرفة الشخص المعني."),
    "QUALITE": ("Qualité en laquelle la personne agit (ex: père, mère, tuteur légal).", "الصفة التي تتصرف بها (مثال: أب، أم، ولي شرعي)."),
    "ETAT_CIVIL_VENDEUR": ("État civil du vendeur (célibataire, marié(e), divorcé(e), veuf/veuve).", "الحالة المدنية للبائع (أعزب، متزوج/ة، مطلق/ة، أرمل/ة)."),
    "ETAT_CIVIL_ACQUEREUR": ("État civil de l'acquéreur (célibataire, marié(e), divorcé(e), veuf/veuve).", "الحالة المدنية للمشتري (أعزب، متزوج/ة، مطلق/ة، أرمل/ة)."),
    "POSTE": ("Intitulé exact du poste ou de la fonction occupée.", "التسمية الدقيقة للمنصب أو الوظيفة المشغولة."),
    "ACTE_ORIGINE": ("Document ou contrat qui est à l'origine de l'obligation (ex: contrat de vente du 01/01/2024).", "الوثيقة أو العقد الذي هو أصل الالتزام (مثال: عقد بيع بتاريخ 01/01/2024)."),
    "TAUX": ("Taux en pourcentage (ex: 10 pour 10%).", "النسبة المئوية (مثال: 10 تعني 10%)."),
    "JOURS_CONGES_DUS": ("Nombre de jours de congés non pris et à payer au salarié.", "عدد أيام الراحة غير المستعملة والمستحقة الدفع للأجير."),
}

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

    # Use extra field hints
    if name in EXTRA_FIELD_HINTS:
        return EXTRA_FIELD_HINTS[name]

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
    elif ftype == "vehicle":
        return (
            f"Caractéristique du véhicule {role_fr}.".strip(),
            f"خاصية فنية للعربة {role_ar}.".strip(),
        )
    elif ftype == "identifier":
        return (
            f"Numéro d'identification officiel {role_fr}.".strip(),
            f"رقم تعريف رسمي {role_ar}.".strip(),
        )
    elif ftype == "count":
        return (
            f"Nombre {role_fr}.".strip(),
            f"العدد {role_ar}.".strip(),
        )
    elif ftype == "reading":
        return (
            f"Relevé du compteur {role_fr}.".strip(),
            f"قراءة العداد {role_ar}.".strip(),
        )
    elif ftype == "conditions":
        return (
            f"Conditions ou modalités particulières {role_fr}.".strip(),
            f"شروط أو كيفيات خاصة {role_ar}.".strip(),
        )
    elif ftype == "description":
        return (
            f"Décrivez brièvement {label_fr.lower()} {role_fr}.".strip(),
            f"صف بإيجاز {label_ar} {role_ar}.".strip(),
        )
    elif ftype == "estate-condition":
        return (
            f"État de cet élément à l'entrée ou à la sortie (bon, moyen, dégradé).".strip(),
            f"حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).".strip(),
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
    if "NOM" in upper or "PRENOM" in upper or "REPRESENTANT" in upper or "DESTINATAIRE" in upper:
        return "name"
    if "ADRESSE" in upper or "LIEU" in upper or "SIEGE" in upper:
        return "address"
    if "DATE" in upper:
        return "date"
    if any(w in upper for w in ["MONTANT", "PRIX", "LOYER", "CAUTION", "CAPITAL", "SALAIRE", "SOMME", "HONORAIRE", "DETTE", "SUBVENTION", "COMPLEMENT", "PART_", "AVANCE", "SOLDE", "INDEMNITE"]):
        return "amount"
    if any(w in upper for w in ["DUREE", "PREAVIS", "DELAI", "PERIODE", "MOIS", "ANNEE", "ANNEE_"]):
        return "duration"
    if "EMAIL" in upper or "MAIL" in upper:
        return "email"
    if "TELEPHONE" in upper or "TEL" in upper or "PHONE" in upper or "GSM" in upper:
        return "phone"
    if any(w in upper for w in ["MARQUE", "MODELE", "CYLINDREE", "KILOMETRAGE", "KM_", "CARBURANT", "ENERGIE", "PUISSANCE", "IMMATRICULATION"]):
        return "vehicle"
    if any(w in upper for w in ["RNE", "NUM_CHASSIS", "NUM_CADRE", "NUM_MOTEUR", "TITRE_FONCIER", "CHASSIS", "NUM_", "NUMERO_"]):
        return "identifier"
    if any(w in upper for w in ["NB_", "NOMBRE_", "NBRE_"]):
        return "count"
    if any(w in upper for w in ["INDEX_", "COMPTEUR"]):
        return "reading"
    if any(w in upper for w in ["GARANTI", "CONDITIONS", "MODALITES", "REPARTITION", "AUTRES_"]):
        return "conditions"
    if any(w in upper for w in ["DESCRIPTION", "DECLARATION", "MOTIF", "OBJET", "MISSION", "OBLIGATION", "MANQUEMENT", "SOMMATION", "SCOPE", "OBS_"]):
        return "description"
    if any(w in upper for w in ["SOL_", "MURS_", "MUR_", "PLAFOND", "FENETRES", "PLACARD", "EVIER", "MEUBLES", "SANITAIRE", "ROBINETTERIE"]):
        return "estate-condition"
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

        # Apply slug-specific overrides
        slug = data.get("slug", "")
        if slug in SLUG_HINTS:
            for name, (hf, ha) in SLUG_HINTS[slug].items():
                if name in data.get("field_metadata", {}):
                    data["field_metadata"][name]["help_fr"] = hf
                    data["field_metadata"][name]["help_ar"] = ha

        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        count += 1

    print(f"Generated contextual help for {count} templates")


if __name__ == "__main__":
    process_all()
