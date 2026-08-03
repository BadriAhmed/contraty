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
  Home,
  Briefcase,
  Coins,
  Car,
  Building2,
  ChevronRight,
} from "lucide-react";
import Ad from "@/components/ads/Ad";
import type { FieldMeta } from "@/types";

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
        <Link href={`/${lang}/v2`} className="text-primary hover:underline mt-4 inline-block">
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

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Link href={`/${lang}/v2`} className="hover:text-primary transition-colors">
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
                  href={`/${lang}/v2/generate/${template.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 text-base"
                >
                  {lang === "ar" ? "ابدأ الآن" : "Commencer"}
                  {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Link>
                <Link
                  href={`/${lang}/v2/blank/${template.slug}`}
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
              <div className="bg-surface rounded-2xl border border-outline-variant/40 p-5">
                <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <PenLine size={14} className="text-primary" />
                  {lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
                </h4>
                <ol className="space-y-2.5 text-sm text-text-secondary">
                  {[
                    lang === "ar" ? "اختر الحقول واملأها" : "Choisissez et remplissez les champs",
                    lang === "ar" ? "راجع العقد المُنشأ" : "Révisez le contrat généré",
                    lang === "ar" ? "حمّل بصيغة PDF أو Word" : "Téléchargez en PDF ou Word",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <Ad size="rectangle" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
