import Link from "next/link";
import { fetchTemplate } from "@/lib/constants";
import { ArrowLeft, FileText, Clock } from "lucide-react";

export default async function ContractDetailPage({ params }) {
  const { lang, type } = params;
  const template = await fetchTemplate(type);

  if (!template) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">
          {lang === "ar" ? "العقد غير موجود" : "Contrat introuvable"}
        </h1>
        <Link href={`/${lang}/contracts`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة للقائمة" : "Retour aux modèles"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 py-8">
      <Link
        href={`/${lang}/contracts`}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-6"
      >
        <ArrowLeft size={14} />
        {lang === "ar" ? "العقود" : "Contrats"}
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-headline-section text-on-surface mb-2">{title}</h1>
        <p className="text-text-secondary mb-6">{template.legal_basis}</p>

        <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
          <span className="flex items-center gap-1">
            <FileText size={14} />
            {template.field_count} {lang === "ar" ? "حقل" : "champs"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {template.complexity === "low"
              ? lang === "ar" ? "بسيط" : "Simple"
              : template.complexity === "high"
              ? lang === "ar" ? "معقد" : "Complexe"
              : lang === "ar" ? "متوسط" : "Moyen"}
          </span>
        </div>

        {/* Sections preview */}
        <div className="space-y-4 mb-8">
          {template.sections?.map((section) => (
            <div key={section.id} className="bg-surface-container-lowest border border-border-slate rounded-xl p-5">
              <h3 className="text-sm font-semibold text-primary mb-3">
                {lang === "ar" ? section.title_ar : section.title_fr}
              </h3>
              <div className="space-y-3">
                {section.articles?.map((article) => (
                  <div key={article.id} className="text-sm text-on-surface leading-relaxed">
                    <p className="opacity-70">
                      {lang === "ar" ? article.text_ar : article.text_fr}
                    </p>
                    {article.fields?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {article.fields.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 text-xs rounded bg-primary-fixed/50 text-primary font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/${lang}/generate/${template.slug}`}
          className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors shadow-sm"
        >
          <FileText size={18} />
          {lang === "ar" ? "إنشاء هذا العقد" : "Générer ce contrat"}
        </Link>
      </div>
    </div>
  );
}
