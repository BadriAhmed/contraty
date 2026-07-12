import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import { Home, Briefcase, Coins, Car, Building2, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const domainMeta = {
  logement: { icon: Home, cat: "real-estate", color: "var(--cat-real-estate)" },
  travail: { icon: Briefcase, cat: "employment", color: "var(--cat-employment)" },
  argent: { icon: Coins, cat: "family", color: "var(--cat-family)" },
  vehicules: { icon: Car, cat: "services", color: "var(--cat-services)" },
  entreprise: { icon: Building2, cat: "business", color: "var(--cat-business)" },
  demarches: { icon: FileText, cat: "documents", color: "var(--cat-documents)" },
};

export default async function HomePage({ params, searchParams }) {
  const { lang } = params;
  const activeDomain = searchParams?.domain || null;
  const templates = await fetchTemplates({ language: lang });

  const filtered = activeDomain
    ? templates.filter((t) => t.domain === activeDomain)
    : templates;

  const domainLabel = activeDomain && DOMAINS[activeDomain]
    ? (lang === "ar" ? DOMAINS[activeDomain].ar : DOMAINS[activeDomain].fr)
    : null;

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

      {/* Template grid section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-on-surface mb-2">
            {domainLabel || (lang === "ar" ? "نماذج العقود" : "Modèles de contrats")}
          </h2>
          <p className="text-sm text-text-secondary">
            {filtered.length} {lang === "ar" ? "نموذج" : "modèle"}{filtered.length > 1 ? "s" : ""}{" "}
            {lang === "ar" ? "متاح" : "disponible"}{filtered.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/${lang}`}>
            <button className={`filter-pill ${!activeDomain ? "active" : ""}`}>
              {lang === "ar" ? "الكل" : "Tous"}
            </button>
          </Link>
          {Object.entries(DOMAINS).map(([key, dom]) => {
            const meta = domainMeta[key];
            const Icon = meta.icon;
            return (
              <Link key={key} href={`/${lang}?domain=${key}`}>
                <button
                  className={`filter-pill ${activeDomain === key ? "active" : ""}`}
                  style={activeDomain === key ? {} : { color: "var(--on-surface-variant)" }}
                >
                  <Icon size={13} className="inline me-1" style={{ color: activeDomain === key ? undefined : meta.color }} />
                  {lang === "ar" ? dom.ar : dom.fr}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Template cards with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {filtered.map((t) => {
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

        {/* Legal disclaimer */}
        <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/50 inline-block mb-8">
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
            {lang === "ar"
              ? "جميع النماذج مبنية على القوانين التونسية (مجلة الالتزامات والعقود، مجلة الشغل، مجلة الشركات التجارية)"
              : "Tous les modèles sont basés sur les codes juridiques tunisiens : Code des Obligations et des Contrats (COC), Code du Travail (CT), Code des Sociétés Commerciales (CS)"}
          </p>
        </div>
      </section>
    </div>
  );
}
