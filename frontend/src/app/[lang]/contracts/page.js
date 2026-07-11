import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import { Home, Briefcase, Coins, Car, Building2, FileText, ChevronRight, ChevronLeft } from "lucide-react";

const domainMeta = {
  logement: { icon: Home, cat: "real-estate", color: "var(--cat-real-estate)" },
  travail: { icon: Briefcase, cat: "employment", color: "var(--cat-employment)" },
  argent: { icon: Coins, cat: "family", color: "var(--cat-family)" },
  vehicules: { icon: Car, cat: "services", color: "var(--cat-services)" },
  entreprise: { icon: Building2, cat: "business", color: "var(--cat-business)" },
  demarches: { icon: FileText, cat: "documents", color: "var(--cat-documents)" },
};

export default async function ContractsPage({ params, searchParams }) {
  const { lang } = params;
  const domain = searchParams?.domain;
  const templates = await fetchTemplates({ domain, language: lang });
  const isRtl = lang === "ar";
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const domainLabel = domain && DOMAINS[domain]
    ? (lang === "ar" ? DOMAINS[domain].ar : DOMAINS[domain].fr)
    : null;

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 py-8">
      {/* Compact header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          {domainLabel || (lang === "ar" ? "نماذج العقود التونسية" : "Modèles de contrats tunisiens")}
        </h1>
        <p className="text-sm text-text-secondary">
          {templates.length} {lang === "ar" ? "نموذج" : "modèle"}{templates.length > 1 ? "s" : ""}{" "}
          {lang === "ar" ? "متاح" : "disponible"}{templates.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-52 shrink-0">
          <div className="space-y-5 sticky top-20">
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-2">
                {lang === "ar" ? "المجال" : "Domaine"}
              </h4>
              <div className="space-y-0.5">
                <Link href={`/${lang}/contracts`} className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!domain ? "bg-primary/10 text-primary font-medium" : "text-on-surface-variant hover:bg-surface-container"}`}>
                  {lang === "ar" ? "الكل" : "Tous"}
                </Link>
                {Object.entries(DOMAINS).map(([key, dom]) => {
                  const meta = domainMeta[key];
                  const Icon = meta.icon;
                  return (
                    <Link key={key} href={`/${lang}/contracts?domain=${key}`} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${domain === key ? "bg-primary/10 text-primary font-medium" : "text-on-surface-variant hover:bg-surface-container"}`}>
                      <Icon size={14} style={{ color: meta.color }} />
                      <span>{lang === "ar" ? dom.ar : dom.fr}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/50">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {lang === "ar"
                  ? "جميع النماذج مبنية على القوانين التونسية (مجلة الالتزامات والعقود، مجلة الشغل، مجلة الشركات التجارية)"
                  : "Tous les modèles sont basés sur les codes juridiques tunisiens : Code des Obligations et des Contrats (COC), Code du Travail (CT), Code des Sociétés Commerciales (CS)"}
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {templates.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <p className="text-base mb-2">
                {lang === "ar" ? "لا توجد نماذج في هذا المجال" : "Aucun modèle dans ce domaine"}
              </p>
              <Link href={`/${lang}/contracts`} className="text-primary hover:underline text-sm">
                {lang === "ar" ? "عرض الكل" : "Voir tout"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {templates.map((t) => {
                const meta = domainMeta[t.domain] || domainMeta.demarches;
                const Icon = meta.icon;
                const title = lang === "ar" ? t.title_ar : t.title_fr;

                return (
                  <Link
                    key={t.slug}
                    href={`/${lang}/contracts/${t.slug}`}
                    className="group bg-surface-container-lowest border border-border-slate rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150 flex items-start gap-3"
                    style={{ borderInlineStartWidth: "3px", borderInlineStartColor: meta.color }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${meta.color}15` }}
                    >
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {t.field_count} {lang === "ar" ? "حقل" : "champs"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
