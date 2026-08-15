import Link from "next/link";
import { fetchTemplate, DOMAINS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  Scale,
  Clock,
  ListChecks,
  PenLine,
  Search,
  Home,
  Briefcase,
  Coins,
  Car,
  Building2,
  ChevronRight,
} from "lucide-react";
import Ad from "@/components/ads/Ad";
import type { FieldMeta } from "@/types";
import TrackOnMount from "@/components/v2/TrackOnMount";

export const dynamic = "force-dynamic";

const domainIcons: Record<string, typeof Home> = {
  logement: Home,
  travail: Briefcase,
  argent: Coins,
  vehicules: Car,
  entreprise: Building2,
  demarches: FileText,
};

const domainColors: Record<string, string> = {
  logement: "var(--cat-real-estate)",
  travail: "var(--cat-employment)",
  argent: "var(--cat-family)",
  vehicules: "var(--cat-services)",
  entreprise: "var(--cat-business)",
  demarches: "var(--cat-documents)",
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  ar: { text: "نص", number: "رقم", cin: "بطاقة تعريف", email: "بريد إلكتروني", phone: "هاتف", date: "تاريخ", percentage: "نسبة", select: "اختيار" },
  fr: { text: "Texte", number: "Nombre", cin: "CIN", email: "Email", phone: "Téléphone", date: "Date", percentage: "Pourcentage", select: "Choix" },
};

export default async function V2ContractDetail({ params }: { params: { lang: string; type: string } }) {
  const { lang, type } = params;
  const template = await fetchTemplate(type);
  const isRtl = lang === "ar";

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">
          {lang === "ar" ? "العقد غير موجود" : "Contrat introuvable"}
        </h1>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;
  const description = lang === "ar" ? (template.description_ar || "") : (template.description_fr || "");
  const typeLabel = TYPE_LABELS[lang];
  const domainColor = domainColors[template.domain] || "var(--primary)";
  const DomainIcon = domainIcons[template.domain] || FileText;
  const domainName = DOMAINS[template.domain] ? (lang === "ar" ? DOMAINS[template.domain].ar : DOMAINS[template.domain].fr) : "";

  // Collect fields by section
  const fieldsBySection: Record<string, Array<{ name: string; label: string; type: string; help: string; required: boolean }>> = {};
  const seen = new Set<string>();
  for (const section of template.sections || []) {
    const secTitle = lang === "ar" ? section.title_ar : section.title_fr;
    for (const article of section.articles || []) {
      for (const field of article.fields || []) {
        if (!seen.has(field)) {
          seen.add(field);
          if (!fieldsBySection[secTitle]) fieldsBySection[secTitle] = [];
          const meta: FieldMeta = template.field_metadata?.[field] || ({} as FieldMeta);
          fieldsBySection[secTitle].push({
            name: field,
            label: lang === "ar" ? (meta.label_ar || field) : (meta.label_fr || field.replace(/_/g, " ")),
            type: meta.type || "text",
            help: lang === "ar" ? (meta.help_ar || "") : (meta.help_fr || ""),
            required: meta.required !== false,
          });
        }
      }
    }
  }

  const fieldCount = template.field_count || seen.size;
  const estMinutes = Math.ceil(fieldCount / 5);

  const steps = [
    {
      icon: PenLine,
      step: "1",
      title: lang === "ar" ? "املأ الحقول" : "Remplissez les champs",
      desc: lang === "ar"
        ? "أدخل معلوماتك خطوة بخطوة مع تلميحات وتحقق فوري"
        : "Saisissez vos informations étape par étape avec indices et validation instantanée",
    },
    {
      icon: Search,
      step: "2",
      title: lang === "ar" ? "راجع العقد" : "Révisez le contrat",
      desc: lang === "ar"
        ? "تحقق من البنود والاقتراحات قبل التحميل"
        : "Vérifiez les clauses et suggestions avant téléchargement",
    },
    {
      icon: Download,
      step: "3",
      title: lang === "ar" ? "حمّل العقد" : "Téléchargez le contrat",
      desc: lang === "ar"
        ? "PDF أو Word جاهز للتوقيع — في ثوانٍ"
        : "PDF ou Word prêt à signer — en quelques secondes",
    },
  ];

  return (
    <div className="bg-background">
      <TrackOnMount event="template_view" props={{ slug: type, domain: template.domain, lang }} />
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Link href={`/${lang}`} className="hover:text-primary transition-colors">
            {lang === "ar" ? "الرئيسية" : "Accueil"}
          </Link>
          <ChevronRight size={14} className={isRtl ? "rotate-180" : ""} />
          <span className="text-on-surface font-medium">{title}</span>
        </nav>
      </div>

      {/* Hero header */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${domainColor} 15%, transparent)` }}
          >
            <DomainIcon size={22} className="md:size-[28px]" style={{ color: domainColor }} />
          </div>
          <div className="flex-1">
            <span
              className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
              style={{ backgroundColor: `color-mix(in srgb, ${domainColor} 12%, transparent)`, color: domainColor }}
            >
              {domainName}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface leading-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-text-secondary leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-surface rounded-xl border border-outline-variant/40 px-3.5 py-2">
            <Scale size={14} className="text-primary" />
            <span className="text-xs text-text-secondary">
              {lang === "ar" ? "الأساس القانوني" : "Base légale"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface rounded-xl border border-outline-variant/40 px-3.5 py-2">
            <ListChecks size={14} className="text-primary" />
            <span className="text-xs text-on-surface-variant">
              {fieldCount} {lang === "ar" ? (fieldCount === 1 ? "حقل" : fieldCount === 2 ? "حقلان" : "حقول") : (fieldCount > 1 ? "champs" : "champ")}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface rounded-xl border border-outline-variant/40 px-3.5 py-2">
            <Clock size={14} className="text-primary" />
            <span className="text-xs text-on-surface-variant">
              {lang === "ar" ? `حوالي ${estMinutes} ${estMinutes === 1 ? "دقيقة" : estMinutes === 2 ? "دقيقتين" : "دقائق"}` : `~${estMinutes} min`}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface rounded-xl border border-outline-variant/40 px-3.5 py-2">
            <span className="w-2 h-2 rounded-full bg-success-green" />
            <span className="text-xs text-on-surface-variant">
              {lang === "ar" ? "مجاني" : "Gratuit"}
            </span>
          </div>
          {template.generation_count !== undefined && template.generation_count > 0 && (
            <div className="flex items-center gap-2 bg-primary/8 rounded-xl border border-primary/15 px-3.5 py-2">
              <span className="text-xs font-semibold text-primary">
                {template.generation_count}
              </span>
              <span className="text-xs text-text-secondary">
                {lang === "ar" ? "عقد مُنشأ" : "contrats générés"}
              </span>
            </div>
          )}
        </div>

        {/* Legal basis detail */}
        <div className="text-sm text-text-secondary leading-relaxed mb-8">
          <span className="font-medium text-on-surface-variant">
            {lang === "ar" ? "الأساس القانوني: " : "Base légale : "}
          </span>
          {template.legal_basis}
        </div>
      </div>

      {/* Two-col: content + sidebar */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <div className="lg:flex lg:gap-8">
          <div className="lg:flex-1 min-w-0">
            {/* Quick actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-8">
              <Link
                href={`/${lang}/generate/${template.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 text-base"
              >
                {lang === "ar" ? "ابدأ الآن" : "Commencer"}
                {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
              <Link
                href={`/${lang}/blank/${template.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3.5 rounded-xl hover:bg-primary-fixed transition-colors text-base"
              >
                <Download size={16} />
                {lang === "ar" ? "تحميل فارغ" : "Modèle vierge"}
              </Link>
            </div>

            {/* Required fields */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-on-surface mb-1">
                {lang === "ar" ? "المعلومات المطلوبة" : "Informations requises"}
              </h2>
              <p className="text-sm text-text-secondary mb-5">
                {lang === "ar" ? "ستحتاج إلى هذه البيانات لملء العقد" : "Vous aurez besoin de ces informations pour remplir le contrat"}
              </p>
              <div className="space-y-3">
                {Object.entries(fieldsBySection).map(([secTitle, fields]) => (
                  <div key={secTitle} className="bg-surface rounded-2xl border border-outline-variant/40 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border-slate/60 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full" style={{ backgroundColor: domainColor }} />
                      <h3 className="text-sm font-semibold text-on-surface">{secTitle}</h3>
                    </div>
                    <div className="px-5 py-3 space-y-2.5">
                      {fields.map((f) => (
                        <div key={f.name} className="flex items-start gap-2.5">
                          <FileText size={14} className="text-text-secondary shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-on-surface">{f.label}</span>
                            {!f.required && (
                              <span className="text-xs text-text-secondary ms-1.5">
                                ({lang === "ar" ? "اختياري" : "facultatif"})
                              </span>
                            )}
                            <span className="text-xs text-text-secondary/70 ms-1.5">
                              · {typeLabel[f.type] || f.type}
                            </span>
                            {f.help && (
                              <p className="text-xs text-text-secondary/80 mt-0.5 leading-relaxed">{f.help}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-fixed/40 to-surface rounded-2xl border border-primary/15 p-6 md:p-8">
              <h3 className="text-lg font-bold text-on-surface mb-2">
                {lang === "ar" ? "جاهز للبدء؟" : "Prêt à commencer ?"}
              </h3>
              <p className="text-sm text-text-secondary mb-5">
                {lang === "ar" ? "أنشئ عقدك في دقائق — مجانًا تمامًا" : "Créez votre contrat en quelques minutes — entièrement gratuit"}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <Link
                  href={`/${lang}/generate/${template.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 text-base"
                >
                  {lang === "ar" ? "ابدأ الآن" : "Commencer"}
                  {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Link>
                <Link
                  href={`/${lang}/blank/${template.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3.5 rounded-xl hover:bg-primary-fixed transition-colors text-base"
                >
                  <Download size={16} />
                  {lang === "ar" ? "تحميل فارغ" : "Modèle vierge"}
                </Link>
              </div>
            </div>

            {/* Ad */}
            <div className="mt-8 flex justify-center">
              <Ad size="banner" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-lg shadow-primary/25 text-center">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-on-primary/10 text-on-primary text-xs font-semibold uppercase tracking-wide">
                  <PenLine size={14} />
                  {lang === "ar" ? "ثلاث خطوات" : "3 étapes"}
                </div>
                <h2 className="text-2xl font-extrabold text-on-primary tracking-tight">
                  {lang === "ar" ? "كيف يعمل؟" : "Comment ça marche"}
                </h2>
              </div>
              <div className="bg-background rounded-2xl border border-outline-variant/40 p-5 shadow-lg">
                <ol className="space-y-4">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {s.step}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface">{s.title}</p>
                        <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <Ad size="rectangle" />
            </div>
          </aside>
        </div>
      </div>

      {/* How it works (mobile only — sidebar version shows on lg+) */}
      <section className="py-12 md:py-24 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-primary text-on-primary rounded-2xl px-8 py-10 md:px-12 md:py-12 text-center shadow-xl shadow-primary/25 mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-on-primary/10 text-on-primary text-sm font-semibold uppercase tracking-wide">
              <PenLine size={16} />
              {lang === "ar" ? "ثلاث خطوات بسيطة" : "3 étapes simples"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-primary tracking-tight">
              {lang === "ar" ? "كيف يعمل؟" : "Comment ça marche"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-14 start-full w-full h-0.5 border-t-2 border-dashed border-primary/30 -z-0" />
                )}
                <div className="relative bg-background rounded-2xl border border-outline-variant/40 p-10 text-center shadow-lg">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md shadow-primary/25">
                      {s.step}
                    </div>
                    <div className="absolute -top-1 -end-1 w-7 h-7 rounded-full bg-background border border-primary/20 flex items-center justify-center">
                      <s.icon size={14} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
