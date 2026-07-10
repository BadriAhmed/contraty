import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "fr" }];
}

export default function LangLayout({ children, params }) {
  const { lang } = params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} lang={lang} className="flex flex-col min-h-screen bg-background">
      <Navbar messages={{}} />
      <div className="flex-1">{children}</div>
      <Footer lang={lang} />
    </main>
  );
}
