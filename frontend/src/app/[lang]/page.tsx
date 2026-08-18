import Link from "next/link";
import { fetchTemplates, DOMAINS } from "@/lib/constants";
import {
  Home,
  Briefcase,
  Coins,
  Car,
  Building2,
  FileText,
  ShieldCheck,
  Languages,
  Scale,
  Zap,
  CheckCircle2,
  ArrowRight,
  Download,
  PenLine,
  Search,
} from "lucide-react";
import FAQAccordion from "@/components/v2/FAQAccordion";
import TemplateExplorer from "@/components/v2/TemplateExplorer";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const domainMeta: Record<string, { icon: typeof Home; cat: string; color: string }> = {
  logement: { icon: Home, cat: "real-estate", color: "var(--cat-real-estate)" },
  travail: { icon: Briefcase, cat: "employment", color: "var(--cat-employment)" },
  argent: { icon: Coins, cat: "family", color: "var(--cat-family)" },
  vehicules: { icon: Car, cat: "services", color: "var(--cat-services)" },
  entreprise: { icon: Building2, cat: "business", color: "var(--cat-business)" },
  demarches: { icon: FileText, cat: "documents", color: "var(--cat-documents)" },
};

const t = (lang: string, ar: ReactNode, fr: ReactNode): ReactNode => (lang === "ar" ? ar : fr);

export default async function V2HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ q?: string; domain?: string }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const initialQuery = sp?.q || "";
  const initialDomain = sp?.domain || "";
  let templates = [];
  let loadError = false;
  try {
    templates = await fetchTemplates({ language: lang });
  } catch {
    loadError = true;
  }

  return (
    <div className="bg-background">
      {/* ────────────────────────────────────────────
          1. URGENCY BANNER
      ─────────────────────────────────────────────── */}
      <div className="bg-primary text-on-primary text-center text-sm py-2.5 font-medium px-4">
        {t(
          lang,
          "أول منصة تونسية للعقود القانونية ثنائية اللغة",
          "La première plateforme tunisienne de contrats juridiques bilingues",
        )}
      </div>

      {/* ────────────────────────────────────────────
          2. HERO
      ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-fixed/60 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: copy */}
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                {t(
                  lang,
                  <>
                    عقودك القانونية
                    <br />
                    <span className="text-primary">في دقائق</span>
                  </>,
                  <>
                    Vos contrats
                    <br />
                    <span className="text-primary">juridiques</span> en minutes
                  </>,
                )}
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg ms-0">
                {t(
                  lang,
                  "22 نموذجًا قانونيًا مبنيًا على القانون التونسي. اختر، املأ الحقول، واحصل على عقد بصيغة PDF جاهز للتوقيع.",
                  "22 modèles juridiques fondés sur le droit tunisien. Choisissez, remplissez les champs, et obtenez un contrat PDF prêt à signer.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href={`/${lang}#templates`}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 text-base"
                >
                  {t(lang, "ابدأ مجاناً", "Commencer gratuitement")}
                  {lang === "ar" ? null : <ArrowRight size={18} />}
                </Link>
                <Link
                  href={`/${lang}#templates`}
                  className="inline-flex items-center gap-2 text-primary font-semibold px-5 py-3.5 rounded-xl hover:bg-primary-fixed/50 transition-colors text-base"
                >
                  {t(lang, "تصفح النماذج", "Voir les modèles")}
                </Link>
              </div>
              {/* Mini stats */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { num: "22", label: t(lang, "نموذج", "modèles") },
                  { num: "6", label: t(lang, "مجالات", "domaines") },
                  { num: "100%", label: t(lang, "مجاني", "gratuit") },
                ].map((s, i) => (
                  <div key={i} className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-primary">{s.num}</span>
                    <span className="text-sm text-text-secondary">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mock contract card */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />
              <div className="relative space-y-4">
                {/* Mock document */}
                <div className="bg-surface rounded-2xl shadow-xl border border-outline-variant/30 p-6 max-w-sm mx-auto">
                  <div className="h-2 w-1/2 bg-primary/30 rounded-full mb-4" />
                  <div className="space-y-2.5">
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full" />
                    <div className="h-1.5 w-5/6 bg-surface-container-high rounded-full" />
                    <div className="h-1.5 w-4/6 bg-surface-container-high rounded-full" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-slate space-y-2.5">
                    <div className="h-1.5 w-full bg-surface-container rounded-full" />
                    <div className="h-1.5 w-3/4 bg-surface-container rounded-full" />
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-8 w-20 bg-success-green/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-success-green" />
                    </div>
                    <div className="h-1.5 w-24 bg-surface-container-high rounded-full" />
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 start-0 bg-surface rounded-xl shadow-lg border border-outline-variant/30 px-4 py-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-success-green/15 flex items-center justify-center">
                    <Download size={16} className="text-success-green" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">PDF</p>
                    <p className="text-[10px] text-text-secondary">{t(lang, "جاهز للتوقيع", "Prêt à signer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          3. TRUST BAR
      ─────────────────────────────────────────────── */}
      <section className="border-y border-border-slate bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-12">
            {[
              {
                icon: Zap,
                title: t(lang, "سريع ومرن", "Rapide et flexible"),
                desc: t(lang, "للهاتف والحاسوب — في أي وقت", "Sur mobile et ordinateur — à tout moment"),
              },
              {
                icon: Scale,
                title: t(lang, "قانون تونسي", "Droit tunisien"),
                desc: t(lang, "COC، مجلة الشغل، مجلة الشركات", "COC, Code du Travail, Code des Sociétés"),
              },
              {
                icon: ShieldCheck,
                title: t(lang, "آمن وسري", "Sécurisé et privé"),
                desc: t(lang, "لا تخزين للبيانات — بدون حساب", "Aucune donnée stockée — sans compte"),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          4. FEATURES (alternating sections)
      ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              {t(lang, "لماذا كونتراتي؟", "Pourquoi Contraty ?")}
            </h2>
            <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
              {t(
                lang,
                "بسيط، آمن، ومبنى على القانون — هكذا تصنع العقود",
                "Simple, sécurisé et fondé sur la loi — voici comment on crée des contrats",
              )}
            </p>
          </div>

          {[
            {
              icon: Zap,
              eyebrow: t(lang, "سهل وسريع", "Simple et rapide"),
              title: t(lang, "خطوة بخطوة دون مصطلحات معقدة", "Étape par étape, sans jargon juridique"),
              desc: t(
                lang,
                "املأ الحقول ببياناتك، ويتولى النظام الباقي. لا حاجة لخبرة قانونية أو تعقيدات إدارية.",
                "Remplissez les champs avec vos informations, le système s'occupe du reste. Aucune expertise juridique requise.",
              ),
              color: "var(--cat-real-estate)",
            },
            {
              icon: Scale,
              eyebrow: t(lang, "خبرة قانونية", "Expertise juridique"),
              title: t(lang, "مبني على المجلات التونسية", "Fondé sur les codes tunisiens"),
              desc: t(
                lang,
                "كل نموذج يستند إلى مجلة الالتزامات والعقود، مجلة الشغل، أو مجلة الشركات التجارية مع ذكر الأساس القانوني.",
                "Chaque modèle se réfère au Code des Obligations et des Contrats, au Code du Travail ou au Code des Sociétés Commerciales.",
              ),
              color: "var(--cat-employment)",
            },
            {
              icon: Languages,
              eyebrow: t(lang, "ثنائي اللغة", "Bilingue"),
              title: t(lang, "عربي وفرنسي في كل عقد", "Arabe et français pour chaque contrat"),
              desc: t(
                lang,
                "بدّل بين العربية والفرنسية بنقرة واحدة. كل نموذج متاح باللغتين مع دعم كامل للكتابة من اليمين لليسار.",
                "Basculez entre l'arabe et le français en un clic. Chaque modèle est disponible dans les deux langues avec un support RTL complet.",
              ),
              color: "var(--cat-business)",
            },
            {
              icon: ShieldCheck,
              eyebrow: t(lang, "آمن وسري", "Sécurisé et privé"),
              title: t(lang, "بياناتك محمية وغير مخزنة", "Vos données sont protégées et non stockées"),
              desc: t(
                lang,
                "الإنشاء يتم في الجلسة فقط. بمجرد تحميل العقد، تُحذف بياناتك. لا حساب، لا تتبع، لا تسريب.",
                "La génération se fait en session uniquement. Une fois le contrat téléchargé, vos données sont effacées. Pas de compte, pas de suivi.",
              ),
              color: "var(--cat-services)",
            },
          ].map((feat, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 md:gap-10 lg:gap-16 ${
                  i > 0 ? "mt-14 sm:mt-16 md:mt-20" : ""
                }`}
              >
                {/* Text */}
                <div className="flex-1 max-w-lg">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, ${feat.color} 15%, transparent)` }}
                    >
                      <feat.icon size={20} style={{ color: feat.color }} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {feat.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface mb-3">{feat.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
                </div>
                {/* Visual */}
                <div className="flex-1 max-w-sm w-full">
                  <div
                    className="aspect-[4/3] rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${feat.color} 12%, var(--surface)), var(--surface-container-low))`,
                    }}
                  >
                    <feat.icon size={72} style={{ color: feat.color }} className="opacity-80" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────
          5. DOMAIN SHOWCASE + TEMPLATE GRID
      ─────────────────────────────────────────────── */}
      {loadError ? (
        <section id="templates" className="py-16 md:py-24 bg-surface-container-low/50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-3">
              {t(lang, "تعذر تحميل النماذج", "Impossible de charger les modèles")}
            </h2>
            <p className="text-text-secondary mb-6">
              {t(lang, "يرجى التحقق من اتصالك وإعادة المحاولة.", "Veuillez vérifier votre connexion et réessayer.")}
            </p>
            <a
              href={`/${lang}`}
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-xl hover:bg-surface-tint transition-colors"
            >
              {t(lang, "إعادة المحاولة", "Réessayer")}
            </a>
          </div>
        </section>
      ) : (
        <TemplateExplorer lang={lang} templates={templates} initialQuery={initialQuery} initialDomain={initialDomain} />
      )}

      {/* ────────────────────────────────────────────
          6. HOW IT WORKS (3 steps)
      ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-primary text-on-primary rounded-2xl px-8 py-10 md:px-12 md:py-12 text-center shadow-xl shadow-primary/25 mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-on-primary/10 text-on-primary text-sm font-semibold uppercase tracking-wide">
              <Zap size={16} />
              {t(lang, "ثلاث خطوات بسيطة", "3 étapes simples")}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-primary tracking-tight">
              {t(lang, "كيف تعمل المنصة", "Comment ça marche")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-6">
            {[
              {
                icon: Search,
                step: "1",
                title: t(lang, "اختر النموذج", "Choisissez le modèle"),
                desc: t(
                  lang,
                  "تصفح 22 نموذجًا عبر 6 مجالات قانونية واختر ما يناسب احتياجك",
                  "Parcourez 22 modèles dans 6 domaines juridiques et choisissez celui qui vous convient",
                ),
              },
              {
                icon: PenLine,
                step: "2",
                title: t(lang, "املأ الحقول", "Remplissez les champs"),
                desc: t(
                  lang,
                  "أدخل بياناتك (الاسم، بطاقة التعريف، المبالغ...) مع تلميحات وتحقق فوري",
                  "Saisissez vos informations (nom, CIN, montants...) avec indices et validation instantanée",
                ),
              },
              {
                icon: Download,
                step: "3",
                title: t(lang, "حمّل العقد", "Téléchargez le contrat"),
                desc: t(
                  lang,
                  "احصل على عقدك بصيغة PDF أو Word جاهز للتوقيع — في ثوانٍ",
                  "Obtenez votre contrat en PDF ou Word prêt à signer — en quelques secondes",
                ),
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-14 start-full w-full h-0.5 border-t-2 border-dashed border-primary/30 -z-0" />
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

      {/* ────────────────────────────────────────────
          7. STATS BAND
      ─────────────────────────────────────────────── */}
      <section className="bg-primary text-on-primary py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { num: "22", label: t(lang, "نموذج قانوني", "modèles juridiques") },
              { num: "6", label: t(lang, "مجالات قانونية", "domaines juridiques") },
              { num: "2", label: t(lang, "لغتان (عربي/فرنسي)", "langues (arabe/français)") },
              { num: "0", label: t(lang, "د.ت — مجاني", "DT — gratuit") },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold">{s.num}</p>
                <p className="text-xs sm:text-sm text-on-primary/70 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          8. FAQ
      ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              {t(lang, "أسئلة شائعة", "Questions fréquentes")}
            </h2>
          </div>
          <FAQAccordion lang={lang} />
        </div>
      </section>

      {/* ────────────────────────────────────────────
          9. FINAL CTA
      ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-primary-fixed/40 to-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            {t(lang, "جاهز لبدء عقدك؟", "Prêt à créer votre contrat ?")}
          </h2>
          <p className="mt-3 md:mt-4 text-text-secondary text-base md:text-lg">
            {t(
              lang,
              "اختر نموذجًا وأنشئ عقدك القانوني في دقائق — مجانًا تمامًا",
              "Choisissez un modèle et créez votre contrat juridique en quelques minutes — entièrement gratuit",
            )}
          </p>
          <Link
            href={`/${lang}#templates`}
            className="mt-8 inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-4 rounded-xl hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 text-base"
          >
            {t(lang, "ابدأ الآن", "Commencer maintenant")}
            {lang === "ar" ? null : <ArrowRight size={18} />}
          </Link>
        </div>
      </section>
    </div>
  );
}
