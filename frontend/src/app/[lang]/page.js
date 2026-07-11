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
    <div className="max-w-container-max mx-auto px-4 md:px-6">
      {/* Intro / Hero */}
      <section className="py-12 md:py-16 border-b border-border-slate mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4 leading-tight">
            {lang === "ar" ? (
              <>كونتراتي — <span className="text-primary">عقود قانونية</span> تونسية في دقائق</>
            ) : (
              <>Contraty — vos <span className="text-primary">contrats juridiques</span> tunisiens en quelques minutes</>
            )}
          </h1>
          <p className="text-base text-text-secondary leading-relaxed mb-6">
            {lang === "ar"
              ? "أول منصة تونسية لإنشاء العقود القانونية ثنائية اللغة. 22 نموذجًا مبنيًا على القوانين التونسية — مجلة الالتزامات والعقود، مجلة الشغل، ومجلة الشركات التجارية. اختر نموذجك، املأ الحقول، واحصل على عقدك بصيغة PDF جاهز للتوقيع."
              : "La première plateforme tunisienne de génération de contrats juridiques bilingues. 22 modèles fondés sur les codes tunisiens — Code des Obligations et des Contrats, Code du Travail, et Code des Sociétés Commerciales. Choisissez un modèle, remplissez les champs, et obtenez votre contrat en PDF prêt à signer."}
          </p>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <FileText size={14} className="text-primary" />
              {lang === "ar" ? "22 نموذجًا" : "22 modèles"}
            </span>
            <span className="text-border-slate">|</span>
            <span>{lang === "ar" ? "عربي · Français" : "Arabe · Français"}</span>
            <span className="text-border-slate">|</span>
            <span>{lang === "ar" ? "PDF جاهز" : "PDF prêt à signer"}</span>
          </div>
        </div>
      </section>

      {/* Template grid header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {lang === "ar" ? "نماذج العقود" : "Modèles de contrats"}
        </h2>
        <p className="text-sm text-text-secondary">
          {lang === "ar"
            ? `${templates.length} نموذجًا قانونيًا بالعربية والفرنسية`
            : `${templates.length} modèles juridiques bilingues`}
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
