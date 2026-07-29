"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface QA {
  q_fr: string;
  q_ar: string;
  a_fr: string;
  a_ar: string;
}

const FAQS: QA[] = [
  {
    q_fr: "Les modèles sont-ils gratuits ?",
    q_ar: "هل النماذج مجانية؟",
    a_fr:
      "Oui. Les 22 modèles sont entièrement gratuits. La plateforme est financée par la publicité non intrusive affichée pendant les temps d'attente (génération et téléchargement).",
    a_ar:
      "نعم. جميع النماذج الـ22 مجانية بالكامل. تُموَّل المنصة بالإعلانات غير المزعجة التي تظهر خلال أوقات الانتظار (الإنشاء والتحميل).",
  },
  {
    q_fr: "Les contrats sont-ils conformes au droit tunisien ?",
    q_ar: "هل العقود متوافقة مع القانون التونسي؟",
    a_fr:
      "Tous nos modèles sont fondés sur les codes juridiques tunisiens : Code des Obligations et des Contrats (COC), Code du Travail, et Code des Sociétés Commerciales. Chaque modèle indique son fondement légal.",
    a_ar:
      "جميع نماذجنا مبنية على المجلات القانونية التونسية: مجلة الالتزامات والعقود، مجلة الشغل، ومجلة الشركات التجارية. يذكر كل نموذج أساسه القانوني.",
  },
  {
    q_fr: "Comment utiliser la plateforme ?",
    q_ar: "كيف أستخدم المنصة؟",
    a_fr:
      "Trois étapes : choisissez un modèle parmi 22 contrats, remplissez les champs (nom, CIN, montants…), puis téléchargez votre contrat en PDF ou Word prêt à signer.",
    a_ar:
      "ثلاث خطوات: اختر نموذجًا من بين 22 عقدًا، املأ الحقول (الاسم، بطاقة التعريف، المبالغ...)، ثم حمّل عقدك بصيغة PDF أو Word جاهز للتوقيع.",
  },
  {
    q_fr: "Mes données sont-elles sécurisées ?",
    q_ar: "هل بياناتي آمنة؟",
    a_fr:
      "Vos données ne sont pas stockées. La génération se fait en session : une fois le contrat téléchargé, vos informations sont effacées. Aucun compte requis.",
    a_ar:
      "لا يتم تخزين بياناتك. يتم الإنشاء في الجلسة: بمجرد تحميل العقد، تُحذف معلوماتك. لا حاجة لإنشاء حساب.",
  },
  {
    q_fr: "Les contrats sont-ils disponibles en arabe et en français ?",
    q_ar: "هل العقود متاحة بالعربية والفرنسية؟",
    a_fr:
      "Oui, chaque modèle est disponible en arabe et en français. Vous pouvez basculer entre les deux langues à tout moment depuis la barre de navigation.",
    a_ar:
      "نعم، كل نموذج متاح بالعربية والفرنسية. يمكنك التبديل بين اللغتين في أي وقت من شريط التنقل.",
  },
  {
    q_fr: "Ai-je besoin d'un avocat ?",
    q_ar: "هل أحتاج إلى محامٍ؟",
    a_fr:
      "Nos modèles couvrent les situations courantes. Pour des cas complexes ou des clauses personnalisées, nous recommandons de consulter un avocat. Le contrat généré reste un point de départ solide.",
    a_ar:
      "تغطي نماذجنا الحالات الشائعة. في الحالات المعقدة أو البنود المخصصة، ننصح باستشارة محامٍ. يبقى العقد المُنشأ نقطة انطلاق متينة.",
  },
];

export default function FAQAccordion({ lang }: { lang: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="border border-outline-variant/50 rounded-xl bg-surface overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-surface-container-low transition-colors"
            >
              <span className="text-sm font-semibold text-on-surface">
                {lang === "ar" ? faq.q_ar : faq.q_fr}
              </span>
              <ChevronDown
                size={18}
                className={`text-text-secondary shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                {lang === "ar" ? faq.a_ar : faq.a_fr}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
