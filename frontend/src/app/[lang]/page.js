import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import {
  Home, Briefcase, Coins, Car, Building2, FileText,
  ArrowUpRight,
} from "lucide-react";

const domainMeta = {
  logement: { icon: Home, cat: "real-estate" },
  travail: { icon: Briefcase, cat: "employment" },
  argent: { icon: Coins, cat: "family" },
  vehicules: { icon: Car, cat: "services" },
  entreprise: { icon: Building2, cat: "business" },
  demarches: { icon: FileText, cat: "documents" },
};

const complexityLabel = {
  ar: { low: "بسيط", medium: "متوسط", high: "معقد" },
  fr: { low: "Simple", medium: "Moyen", high: "Complexe" },
};

export default async function HomePage({ params }) {
  const { lang } = params;
  const templates = await fetchTemplates({ language: lang });

  // Group by domain for sectioned display
  const byDomain = {};
  for (const t of templates) {
    if (!byDomain[t.domain]) byDomain[t.domain] = [];
    byDomain[t.domain].push(t);
  }
  const domainOrder = ["logement", "travail", "argent", "vehicules", "entreprise", "demarches"];

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="py-12 md:py-16 text-center relative">
        <div className="absolute top-0 start-1/4 w-72 h-72 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="absolute top-10 end-1/4 w-64 h-64 bg-secondary-fixed/30 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-headline-hero-mobile md:text-headline-hero text-on-surface mb-4 leading-tight">
            {lang === "ar" ? (
              <>
                أنشئ عقودًا <span className="text-primary">قانونية</span> تونسية
              </>
            ) : (
              <>
                Créez vos contrats <span className="text-primary">juridiques</span> tunisiens
              </>
            )}
          </h1>

          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
            {lang === "ar"
              ? "أكثر من 22 نموذجًا قانونيًا بالعربية والفرنسية. اختر نموذجك واملأ الحقول واحصل على عقدك الجاهز في دقائق."
              : "Plus de 22 modèles juridiques bilingues. Choisissez un type de contrat, remplissez les champs et obtenez votre document prêt à signer en quelques minutes."}
          </p>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-text-secondary">
            <span className="font-medium">
              {lang === "ar" ? "الأكثر استخدامًا :" : "Les plus demandés :"}
            </span>
            {["bail-habitation", "contrat-cdi", "contrat-cdd", "vente-voiture", "reconnaissance-dette"].map((slug) => {
              const t = templates.find((x) => x.slug === slug);
              if (!t) return null;
              return (
                <Link
                  key={slug}
                  href={`/${lang}/generate/${slug}`}
                  className="text-primary hover:text-primary-container underline underline-offset-2"
                >
                  {lang === "ar" ? t.title_ar : t.title_fr}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All templates by domain */}
      <section className="pb-16">
        {domainOrder.map((domain) => {
          const items = byDomain[domain];
          if (!items || items.length === 0) return null;
          const meta = domainMeta[domain];
          const Icon = meta.icon;
          const catColor = `var(--cat-${meta.cat})`;
          const domainLabel = lang === "ar" ? DOMAINS[domain].ar : DOMAINS[domain].fr;

          return (
            <div key={domain} className="mb-10">
              {/* Domain header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${catColor}18` }}
                >
                  <Icon size={16} style={{ color: catColor }} />
                </div>
                <h2 className="text-lg font-bold text-on-surface">
                  {domainLabel}
                </h2>
                <span className="text-xs text-text-secondary">
                  ({items.length})
                </span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => {
                  const title = lang === "ar" ? t.title_ar : t.title_fr;
                  const isRtl = lang === "ar";

                  return (
                    <Link
                      key={t.slug}
                      href={`/${lang}/generate/${t.slug}`}
                      className="group bg-surface-container-lowest border border-border-slate rounded-xl p-5 hover:border-primary/30 hover:shadow-card-hover transition-all duration-200"
                      style={{ borderInlineStartWidth: "3px", borderInlineStartColor: catColor }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug pe-2">
                          {title}
                        </h3>
                        <ArrowUpRight
                          size={18}
                          className={`text-outline group-hover:text-primary transition-colors shrink-0 ${isRtl ? "rotate-180" : ""}`}
                        />
                      </div>

                      <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                        {t.field_count} {lang === "ar" ? "حقل" : "champs"} &middot;{" "}
                        {complexityLabel[lang][t.complexity] || t.complexity}
                      </p>

                      {/* Field preview */}
                      <div className="flex flex-wrap gap-1">
                        {items[0] === t && (
                          <span
                            className="px-2 py-0.5 text-xs rounded font-medium"
                            style={{ background: `${catColor}12`, color: catColor }}
                          >
                            {lang === "ar" ? "الأكثر طلبًا" : "Le plus demandé"}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
