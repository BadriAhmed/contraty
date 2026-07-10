import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import {
  Home, Briefcase, Coins, Car, Building2, FileText,
  ArrowUpRight, Search,
} from "lucide-react";

const domainMeta = {
  logement: { icon: Home, cat: "real-estate", popularity: 5 },
  travail: { icon: Briefcase, cat: "employment", popularity: 5 },
  argent: { icon: Coins, cat: "family", popularity: 4 },
  vehicules: { icon: Car, cat: "services", popularity: 3 },
  entreprise: { icon: Building2, cat: "business", popularity: 5 },
  demarches: { icon: FileText, cat: "documents", popularity: 4 },
};

export default async function HomePage({ params }) {
  const { lang } = params;
  const templates = await fetchTemplates({ language: lang });

  const featured = templates.filter((t) =>
    ["bail-habitation", "contrat-cdi", "contrat-cdd", "vente-voiture", "prestation-services", "reconnaissance-dette"].includes(t.slug)
  );

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="py-16 md:py-20 text-center relative">
        <div className="absolute top-0 start-1/4 w-72 h-72 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="absolute top-10 end-1/4 w-64 h-64 bg-secondary-fixed/30 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-border-slate rounded-full px-4 py-1.5 text-xs text-on-surface-variant mb-6">
            <span className="w-2 h-2 rounded-full bg-success-green" />
            {lang === "ar" ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}
          </div>

          <h1 className="text-headline-hero-mobile md:text-headline-hero text-on-surface mb-4">
            {lang === "ar" ? (
              <>
                أنشئ عقودًا <span className="text-primary">قانونية</span> تونسية
              </>
            ) : (
              <>
                Create <span className="text-primary">legal contracts</span> for Tunisia
              </>
            )}
          </h1>

          <p className="text-subtitle text-text-secondary mb-8 max-w-xl mx-auto">
            {lang === "ar"
              ? "أكثر من 22 نموذجًا قانونيًا بالعربية والفرنسية. اختر نموذجك واملأ الحقول واحصل على عقدك الجاهز في دقائق."
              : "Over 22 bilingual legal templates. Choose a contract type, fill in the blanks, and get your ready-to-sign document in minutes."}
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-6">
            <div className="flex border-2 border-border-slate rounded-xl overflow-hidden focus-within:border-primary transition-colors">
              <div className="flex items-center ps-4 text-text-secondary">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder={lang === "ar" ? "ابحث عن نموذج..." : "Search templates..."}
                className="flex-1 px-3 py-3 bg-transparent outline-none text-on-surface placeholder:text-text-secondary text-sm"
              />
              <Link
                href={`/${lang}/contracts`}
                className="bg-primary text-on-primary font-semibold text-sm px-5 py-3 hover:bg-surface-tint transition-colors"
              >
                {lang === "ar" ? "بحث" : "Search"}
              </Link>
            </div>
          </div>

          {/* Popular quick links */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-text-secondary">
            <span className="font-medium">{lang === "ar" ? "الشائع:" : "Popular:"}</span>
            {featured.slice(0, 5).map((t) => (
              <Link
                key={t.slug}
                href={`/${lang}/generate/${t.slug}`}
                className="text-primary hover:text-primary-container underline underline-offset-2"
              >
                {lang === "ar" ? t.title_ar : t.title_fr}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Templates grid */}
      <section className="bg-background-page -mx-4 md:-mx-6 px-4 md:px-6 py-12 md:py-16 rounded-3xl">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-headline-section text-on-surface">
                {lang === "ar" ? "جميع النماذج" : "All Templates"}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {lang === "ar"
                  ? `${templates.length} نموذجًا قانونيًا`
                  : `${templates.length} legal templates`}
              </p>
            </div>
          </div>

          {/* Domain filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href={`/${lang}/contracts`}>
              <button className="filter-pill active">
                {lang === "ar" ? "الكل" : "All"}
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

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-gap">
            {featured.map((t) => {
              const meta = domainMeta[t.domain] || domainMeta.demarches;
              const Icon = meta.icon;
              const title = lang === "ar" ? t.title_ar : t.title_fr;
              const catColor = `var(--cat-${meta.cat})`;

              return (
                <Link
                  key={t.slug}
                  href={`/${lang}/generate/${t.slug}`}
                  className="bento-card bg-surface-container-lowest border-border-slate rounded-xl p-6 relative overflow-hidden group"
                  style={{ "--cat-hover": catColor }}
                >
                  {/* Corner decoration */}
                  <div
                    className="absolute top-0 end-0 w-20 h-20 rounded-bl-[80px] opacity-10 group-hover:scale-150 transition-transform duration-300"
                    style={{ background: catColor }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center"
                        style={{ background: `${catColor}14` }}
                      >
                        <Icon size={20} style={{ color: catColor }} />
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="text-outline group-hover:text-primary transition-colors"
                      />
                    </div>

                    {/* Category badge */}
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold mb-3"
                      style={{ background: `${catColor}18`, color: catColor }}
                    >
                      {DOMAINS[t.domain] ? (lang === "ar" ? DOMAINS[t.domain].ar : DOMAINS[t.domain].fr) : t.domain}
                    </span>

                    <h3 className="text-card-title text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t.field_count} {lang === "ar" ? "حقل" : "champs"} &middot; {t.complexity === "low" ? (lang === "ar" ? "بسيط" : "Simple") : t.complexity === "high" ? (lang === "ar" ? "معقد" : "Complexe") : (lang === "ar" ? "متوسط" : "Moyen")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
