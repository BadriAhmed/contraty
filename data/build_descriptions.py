#!/usr/bin/env python3
"""Add description_ar/description_fr to all contract templates."""

import json
from pathlib import Path

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "data" / "templates"

DESCRIPTIONS = {
    "bail-habitation": {
        "ar": "عقد كراء مسكن بين مكري ومكتري — يحدد مدة الكراء، مبلغ الكراء الشهري، التأمين، والتزامات الطرفين وفقًا لمجلة الالتزامات والعقود.",
        "fr": "Contrat de location d'habitation entre un bailleur et un locataire — définit la durée du bail, le loyer mensuel, la caution, et les obligations des deux parties selon le Code des Obligations et des Contrats.",
    },
    "compromis-vente-immobilier": {
        "ar": "وعد بالبيع العقاري يحدد التزام البائع والمشتري قبل إبرام عقد البيع النهائي — يشمل وصف العقار، الثمن، شروط الدفع، والآجال.",
        "fr": "Promesse de vente immobilière engageant le vendeur et l'acheteur avant la signature de l'acte définitif — inclut la description du bien, le prix, les modalités de paiement et les délais.",
    },
    "etat-des-lieux": {
        "ar": "محضر معاينة دخول أو خروج يصف حالة العقار عند بداية أو نهاية عقد الكراء — يوثق حالة الغرف، التجهيزات، والأضرار إن وجدت.",
        "fr": "État des lieux d'entrée ou de sortie décrivant l'état du bien au début ou à la fin du bail — documente l'état des pièces, des équipements et des éventuels dégâts.",
    },
    "quittance-loyer": {
        "ar": "وصل كراء يثبت دفع المستأجر للأجرة الشهرية — وثيقة بسيطة يوقعها المكري لتأكيد استلام مبلغ الكراء عن فترة محددة.",
        "fr": "Quittance de loyer attestant du paiement du loyer par le locataire — document simple signé par le bailleur confirmant la réception du loyer pour une période donnée.",
    },
    "contrat-cdi": {
        "ar": "عقد عمل غير محدد المدة بين مشغل وأجير — يحدد الوظيفة، الأجر، ساعات العمل، الإجازات، وفترة التجربة طبقًا لمجلة الشغل التونسية.",
        "fr": "Contrat de travail à durée indéterminée entre un employeur et un employé — définit le poste, le salaire, les horaires, les congés et la période d'essai selon le Code du Travail tunisien.",
    },
    "contrat-cdd": {
        "ar": "عقد عمل محدد المدة لمشروع أو مهمة مؤقتة — يحدد مدة العقد، سبب التحديد، الأجر، وشروط إنهاء العقد قبل أوانه.",
        "fr": "Contrat de travail à durée déterminée pour un projet ou une mission temporaire — définit la durée, le motif de la durée déterminée, le salaire et les conditions de rupture anticipée.",
    },
    "contrat-sivp": {
        "ar": "عقد صيغ — إدماج في الحياة المهنية — عقد تدريب بين مؤسسة ومتربص تحت إشراف الوكالة التونسية للتشغيل (ATE) لمدة محددة.",
        "fr": "Contrat SIVP — Stage d'Insertion à la Vie Professionnelle — contrat de stage entre une entreprise et un stagiaire sous la tutelle de l'Agence Tunisienne pour l'Emploi (ATE) pour une durée déterminée.",
    },
    "contrat-karama": {
        "ar": "عقد عمل مدعم ضمن برنامج كرامة — عقد تشغيل للأشخاص ذوي الإعاقة بدعم من الدولة التونسية.",
        "fr": "Contrat de travail aidé dans le cadre du programme Karama — contrat d'emploi pour les personnes en situation de handicap avec un soutien de l'État tunisien.",
    },
    "lettre-demission": {
        "ar": "رسالة استقالة رسمية يوجهها الأجير إلى مشغله لإنهاء عقد العمل — تحدد تاريخ الإستقالة ومدة الإخطار المسبق.",
        "fr": "Lettre de démission formelle adressée par l'employé à son employeur pour mettre fin au contrat de travail — précise la date de démission et la durée du préavis.",
    },
    "rupture-conventionnelle": {
        "ar": "اتفاقية إنهاء علاقة الشغل بالتراضي بين المشغل والأجير — تحدد تعويضات نهاية الخدمة وشروط المغادرة الطوعية.",
        "fr": "Rupture conventionnelle du contrat de travail d'un commun accord entre l'employeur et l'employé — définit les indemnités de fin de service et les conditions de départ volontaire.",
    },
    "reconnaissance-dette": {
        "ar": "اعتراف بدين — وثيقة يقر فيها المدين بمبلغ مستحق للدائن مع تحديد أجل السداد وشروطه — سند قانوني قابل للتنفيذ.",
        "fr": "Reconnaissance de dette — document par lequel le débiteur reconnaît devoir une somme au créancier avec l'échéance et les conditions de remboursement — titre exécutoire.",
    },
    "pret-particuliers": {
        "ar": "عقد قرض بين الخواص — يحدد مبلغ القرض، مدة السداد، والفائدة إن وجدت بين شخصين طبيعيين.",
        "fr": "Contrat de prêt entre particuliers — définit le montant du prêt, la durée de remboursement et les intérêts éventuels entre deux personnes physiques.",
    },
    "vente-voiture": {
        "ar": "عقد بيع سيارة بين بائع ومشتري — يحدد مواصفات السيارة، ثمن البيع، رقم الشاسي، وشهادة نقل الملكية (البطاقة الرمادية).",
        "fr": "Contrat de vente de véhicule automobile entre un vendeur et un acheteur — précise les caractéristiques du véhicule, le prix de vente, le numéro de châssis et le certificat de cession (carte grise).",
    },
    "vente-moto": {
        "ar": "عقد بيع دراجة نارية بين بائع ومشتري — يحدد مواصفات الدراجة، ثمن البيع، رقم الشاسي، ووثائق نقل الملكية.",
        "fr": "Contrat de vente de motocyclette entre un vendeur et un acheteur — précise les caractéristiques de la moto, le prix de vente, le numéro de châssis et les documents de cession.",
    },
    "statuts-sarl": {
        "ar": "القانون الأساسي لشركة ذات مسؤولية محدودة (SARL) — يحدد تسمية الشركة، غرضها، رأس مالها، وتسييرها طبقًا لمجلة الشركات التجارية.",
        "fr": "Statuts de Société à Responsabilité Limitée (SARL) — définissent la dénomination, l'objet social, le capital et la gestion de la société selon le Code des Sociétés Commerciales.",
    },
    "prestation-services": {
        "ar": "عقد تقديم خدمات بين مزود خدمة وعميل — يحدد طبيعة الخدمة، مدة العقد، المقابل المالي، وشروط المسؤولية.",
        "fr": "Contrat de prestation de services entre un prestataire et un client — définit la nature de la prestation, la durée, la rémunération et les conditions de responsabilité.",
    },
    "nda-confidentialite": {
        "ar": "اتفاقية سرية (NDA) لحماية المعلومات الحساسة بين الأطراف — تحدد نطاق السرية، مدة الالتزام، والجزاءات عند الإخلال.",
        "fr": "Accord de confidentialité (NDA) pour la protection des informations sensibles entre les parties — définit le périmètre de la confidentialité, la durée de l'engagement et les sanctions en cas de violation.",
    },
    "procuration-speciale": {
        "ar": "وكالة خاصة تخول شخصًا (الوكيل) القيام بإجراء محدد نيابة عن شخص آخر (الموكل) — محددة الغرض والمدة.",
        "fr": "Procuration spéciale autorisant une personne (le mandataire) à accomplir un acte déterminé au nom d'une autre personne (le mandant) — limitée dans son objet et sa durée.",
    },
    "attestation-honneur": {
        "ar": "شهادة على الشرف — إقرار كتابي يوقعه صاحبه يشهد فيه بواقعة أو وضعية معينة — وثيقة إدارية شائعة في تونس.",
        "fr": "Attestation sur l'honneur — déclaration écrite signée par son auteur attestant d'un fait ou d'une situation — document administratif courant en Tunisie.",
    },
    "attestation-hebergement": {
        "ar": "شهادة إيواء — وثيقة يقر فيها شخص بأنه يستضيف شخصًا آخر في مسكنه — مطلوبة للإجراءات الإدارية كتجديد بطاقة التعريف.",
        "fr": "Attestation d'hébergement — document par lequel une personne déclare héberger une autre personne à son domicile — requise pour certaines démarches administratives comme le renouvellement de la CIN.",
    },
    "autorisation-parentale-voyage": {
        "ar": "إذن سفر للقاصر — وثيقة يوقعها الولي يسمح فيها لطفله القاصر بالسفر بمفرده أو مع شخص آخر.",
        "fr": "Autorisation parentale de voyage pour mineur — document signé par le tuteur légal autorisant son enfant mineur à voyager seul ou accompagné d'une autre personne.",
    },
    "mise-en-demeure": {
        "ar": "إنذار قانوني — رسالة رسمية يوجهها شخص إلى آخر لإلزامه بالوفاء بالتزام تعاقدي أو قانوني قبل اللجوء إلى القضاء.",
        "fr": "Mise en demeure — lettre formelle adressée par une personne à une autre pour la contraindre à respecter une obligation contractuelle ou légale avant de saisir la justice.",
    },
}


def process_all():
    count = 0
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        slug = path.stem
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"SKIP {path.name}: {e}")
            continue

        desc = DESCRIPTIONS.get(slug, {})
        data["description_ar"] = desc.get("ar", "")
        data["description_fr"] = desc.get("fr", "")

        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"OK {path.name}")
        count += 1

    print(f"\nProcessed {count} templates")


if __name__ == "__main__":
    process_all()
