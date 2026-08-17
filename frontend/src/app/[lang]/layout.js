import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import AdSenseScript from "@/components/ads/AdSenseScript";
import HtmlDirSync from "@/components/layout/HtmlDirSync";
import PageViewTracker from "@/components/v2/PageViewTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://contraty.tn";

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "fr" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";
  const title = isAr ? "كونتراتي — عقود قانونية تونسية" : "Contraty — Contrats juridiques tunisiens";
  const description = isAr
    ? "أول منصة تونسية لإنشاء العقود القانونية ثنائية اللغة. 22 نموذجًا مبنيًا على القانون التونسي."
    : "La première plateforme tunisienne de génération de contrats juridiques bilingues. 22 modèles fondés sur le droit tunisien.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "Contraty",
      locale: isAr ? "ar_TN" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        fr: `/fr`,
        ar: `/ar`,
      },
    },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} lang={lang} className="flex flex-col min-h-screen bg-background">
      <HtmlDirSync lang={lang} />
      <PageViewTracker lang={lang} />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer lang={lang} />
      <AdSenseScript />
    </main>
  );
}
