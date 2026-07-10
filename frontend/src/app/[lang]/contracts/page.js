import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import {
  Home, Briefcase, Coins, Car, Building2, FileText,
  ArrowUpRight, ChevronRight, Clock,
} from "lucide-react";

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

  const domainLabel = domain && DOMAINS[domain]
    ? (lang === "ar" ? DOMAINS[domain].ar : DOMAINS[domain].fr)
    : null;

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href={`/${lang}`} className="hover:text-primary transition-colors">
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight size={14} />
        <Link href={`/${lang}/contracts`} className="hover:text-primary transition-colors">
          {lang === "ar" ? "النماذج" : "Templates"}
        </Link>
        {domainLabel && (
          <>
            <ChevronRight size={14} />
            <span className="text-on-surface font-medium">{domainLabel}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-headline-section text-on-surface mb-2">
          {domainLabel || (lang === "ar" ? "جميع النماذج القانونية" : "Tous les modèles juridiques")}
        </h1>
        <p className="text-text-secondary">
          {templates.length} {lang === "ar" ? "نموذج" : "modèle"}{templates.length > 1 ? "s" : ""} {lang === "ar" ? "متاح" : "disponible"}{templates.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="space-y-6 sticky top-24">
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-3">
                {lang === "ar" ? "المجال" : "Domaine"}
              </h4>
              <div className="space-y-1">
                <Link
                  href={`/${lang}/contracts`}
                  className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                    !domain
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {lang === "ar" ? "الكل" : "Tous"}
                </Link>
                {Object.entries(DOMAINS).map(([key, dom]) => {
                  const meta = domainMeta[key];
                  const Icon = meta.icon;
                  return (
                    <Link
                      key={key}
                      href={`/${lang}/contracts?domain=${key}`}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
                        domain === key
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      <Icon size={16} style={{ color: meta.color }} />
                      <span>{lang === "ar" ? dom.ar : dom.fr}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/50">
              <p className="text-xs text-on-surface-variant">
                {lang === "ar"
                  ? "📌 جميع النماذج مبنية على القوانين التونسية (م.إ.ع، م.ش، م.ش.ت)"
                  : "📌 Tous les modèles sont basés sur les codes juridiques tunisiens (COC, CT, CS)"}
              </p>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <main className="flex-1">
          {templates.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <p className="text-lg mb-2">
                {lang === "ar" ? "لا توجد نماذج في هذا المجال" : "Aucun modèle dans ce domaine"}
              </p>
              <Link href={`/${lang}/contracts`} className="text-primary hover:underline text-sm">
                {lang === "ar" ? "عرض الكل" : "Voir tout"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-grid-gap">
              {templates.map((t) => {
                const meta = domainMeta[t.domain] || domainMeta.demarches;
                const Icon = meta.icon;
                const title = lang === "ar" ? t.title_ar : t.title_fr;

                return (
                  <Link
                    key={t.slug}
                    href={`/${lang}/generate/${t.slug}`}
                    className="bento-card bg-surface border-border-slate rounded-xl p-5 flex flex-col relative overflow-hidden group"
                    style={{ "--cat-hover": meta.color }}
                  >
                    <div
                      className="absolute top-0 end-0 w-16 h-16 rounded-bl-[60px] opacity-10 group-hover:scale-150 transition-transform duration-300"
                      style={{ background: meta.color }}
                    />

                    <div className="relative flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: `${meta.color}15` }}
                        >
                          <Icon size={18} style={{ color: meta.color }} />
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-outline group-hover:text-primary transition-colors shrink-0"
                        />
                      </div>

                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant mb-2">
                        {lang === "ar"
                          ? (DOMAINS[t.domain]?.ar || t.domain)
                          : (DOMAINS[t.domain]?.fr || t.domain)}
                      </span>

                      <h3 className="text-sm font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-3 pt-3 border-t border-border-slate/50">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {t.field_count} {lang === "ar" ? "حقل" : "champs"}
                        </span>
                        <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">
                          {lang === "ar" ? "تخصيص ←" : "→ Personnaliser"}
                        </span>
                      </div>
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
