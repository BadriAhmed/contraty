import Link from "next/link";
import { fetchTemplate } from "@/lib/constants";
import { ArrowLeft, ArrowRight, FileText, Download } from "lucide-react";

const TYPE_LABELS = {
  ar: {
    text: "نص",
    number: "رقم",
    cin: "بطاقة تعريف (8 أرقام)",
    email: "بريد إلكتروني",
    phone: "هاتف",
    date: "تاريخ",
    percentage: "نسبة مئوية",
  },
  fr: {
    text: "Texte",
    number: "Nombre",
    cin: "CIN (8 chiffres)",
    email: "Email",
    phone: "Téléphone",
    date: "Date",
    percentage: "Pourcentage",
  },
};

export default async function ContractDetailPage({ params }) {
  const { lang, type } = params;
  const template = await fetchTemplate(type);
  const isRtl = lang === "ar";

  if (!template) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">
          {lang === "ar" ? "العقد غير موجود" : "Contrat introuvable"}
        </h1>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;
  const description = lang === "ar" ? (template.description_ar || "") : (template.description_fr || "");
  const typeLabel = TYPE_LABELS[lang];

  // Collect fields by section with their metadata
  const fieldsBySection = {};
  const seen = new Set();
  for (const section of template.sections || []) {
    const secTitle = lang === "ar" ? section.title_ar : section.title_fr;
    for (const article of section.articles || []) {
      for (const field of article.fields || []) {
        if (!seen.has(field)) {
          seen.add(field);
          if (!fieldsBySection[secTitle]) fieldsBySection[secTitle] = [];
          const meta = template.field_metadata?.[field] || {};
          fieldsBySection[secTitle].push({
            name: field,
            label: lang === "ar" ? (meta.label_ar || field) : (meta.label_fr || field.replace(/_/g, " ")),
            type: meta.type || "text",
            help: lang === "ar" ? (meta.help_ar || "") : (meta.help_fr || ""),
          });
        }
      }
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 py-8">
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-6"
      >
        <ArrowLeft size={14} />
        {lang === "ar" ? "الرئيسية" : "Accueil"}
      </Link>

      <div className="max-w-2xl">
        {/* Title + description */}
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-3">{title}</h1>

        {description && (
          <p className="text-base text-text-secondary leading-relaxed mb-6">{description}</p>
        )}

        <p className="text-sm text-text-secondary mb-8">
          {lang === "ar" ? "الأساس القانوني" : "Base légale"} : {template.legal_basis}
        </p>

        {/* Required fields */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-on-surface mb-4">
            {lang === "ar" ? "المعلومات المطلوبة" : "Informations requises"}
          </h2>

          <div className="space-y-4">
            {Object.entries(fieldsBySection).map(([secTitle, fields]) => (
              <div key={secTitle} className="bg-surface-container-lowest border border-border-slate rounded-lg p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">{secTitle}</h3>
                <div className="space-y-3">
                  {fields.map((f) => (
                    <div key={f.name} className="flex items-start gap-2">
                      <FileText size={14} className="text-text-secondary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-on-surface">{f.label}</span>
                        <span className="text-xs text-text-secondary ms-1.5">
                          ({typeLabel[f.type] || f.type})
                        </span>
                        {f.help && (
                          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed opacity-80">{f.help}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start + Blank buttons — same line */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/generate/${template.slug}`}
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm text-base"
          >
            {lang === "ar" ? "ابدأ الآن" : "Commencer"}
            {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </Link>

          <Link
            href={`/${lang}/blank/${template.slug}`}
            className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-6 py-3.5 rounded-lg hover:bg-primary-fixed transition-colors text-base"
          >
            <Download size={16} />
            {lang === "ar" ? "تحميل النموذج فارغاً" : "Télécharger le modèle vierge"}
          </Link>
        </div>

        <p className="text-xs text-text-secondary mt-4">
          {lang === "ar"
            ? `${template.field_count} حقلاً يجب ملؤها — حوالي ${Math.ceil(template.field_count / 5)} دقائق`
            : `${template.field_count} champs à remplir — environ ${Math.ceil(template.field_count / 5)} minutes`}
        </p>
      </div>
    </div>
  );
}
