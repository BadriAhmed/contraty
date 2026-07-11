import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import { Home, Briefcase, Coins, Car, Building2, FileText } from "lucide-react";

const domainMeta = {
  logement: { icon: Home, cat: "real-estate" },
  travail: { icon: Briefcase, cat: "employment" },
  argent: { icon: Coins, cat: "family" },
  vehicules: { icon: Car, cat: "services" },
  entreprise: { icon: Building2, cat: "business" },
  demarches: { icon: FileText, cat: "documents" },
};

export default async function HomePage({ params }) {
  const { lang } = params;
  const templates = await fetchTemplates({ language: lang });

  const byDomain = {};
  for (const t of templates) {
    if (!byDomain[t.domain]) byDomain[t.domain] = [];
    byDomain[t.domain].push(t);
  }
  const domainOrder = ["logement", "travail", "argent", "vehicules", "entreprise", "demarches"];

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 py-8">
      {/* Compact header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          {lang === "ar" ? "نماذج العقود التونسية" : "Modèles de contrats tunisiens"}
        </h1>
        <p className="text-sm text-text-secondary">
          {lang === "ar"
            ? "22 نموذجًا قانونيًا بالعربية والفرنسية — اختر نموذجًا واملأ الحقول واحصل على عقدك الجاهز"
            : "22 modèles juridiques bilingues — choisissez un type de contrat, remplissez les champs et obtenez votre document prêt à signer"}
        </p>
      </div>

      {/* Category pill bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href={`/${lang}`}>
          <button className="filter-pill active">
            {lang === "ar" ? "الكل" : "Tous"}
          </button>
        </Link>
        {Object.entries(DOMAINS).map(([key, dom]) => (
          <Link key={key} href={`/${lang}/contracts?domain=${key}`}>
            <button className="filter-pill">
              {lang === "ar" ? dom.ar : dom.fr}
            </button>
          </Link>
        ))}
      </div>

      {/* Domains + cards */}
      {domainOrder.map((domain) => {
        const items = byDomain[domain];
        if (!items || items.length === 0) return null;
        const meta = domainMeta[domain];
        const Icon = meta.icon;
        const catColor = `var(--cat-${meta.cat})`;
        const domainLabel = lang === "ar" ? DOMAINS[domain].ar : DOMAINS[domain].fr;

        return (
          <div key={domain} className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{ background: `${catColor}18` }}
              >
                <Icon size={14} style={{ color: catColor }} />
              </div>
              <h2 className="text-base font-bold text-on-surface">{domainLabel}</h2>
              <span className="text-xs text-text-secondary">({items.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {items.map((t) => {
                const title = lang === "ar" ? t.title_ar : t.title_fr;

                return (
                  <Link
                    key={t.slug}
                    href={`/${lang}/generate/${t.slug}`}
                    className="group bg-surface-container-lowest border border-border-slate rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-150"
                    style={{ borderInlineStartWidth: "3px", borderInlineStartColor: catColor }}
                  >
                    <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {t.field_count} {lang === "ar" ? "حقل" : "champs"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
