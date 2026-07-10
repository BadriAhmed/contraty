import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { fetchTemplates } from "@/lib/constants";
import { DOMAINS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const domainIcons = {
  logement: "🏠",
  travail: "💼",
  argent: "💰",
  vehicules: "🚗",
  entreprise: "🏢",
  demarches: "📋",
};

export default async function HomePage({ params }) {
  const { lang } = params;
  const msg = getMessages(lang);
  const templates = await fetchTemplates({ language: lang });

  const byDomain = {};
  for (const t of templates) {
    if (!byDomain[t.domain]) byDomain[t.domain] = [];
    byDomain[t.domain].push(t);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">{msg.home?.hero}</h1>
        <p className="text-lg text-muted-foreground mb-8">{msg.home?.heroSub}</p>
        <a href={`/${lang}/contracts`}>
          <Button size="lg">{msg.home?.cta}</Button>
        </a>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-8">{msg.home?.domains}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(DOMAINS).map(([key, domain]) => {
            const count = (byDomain[key] || []).length;
            if (count === 0) return null;
            return (
              <Link key={key} href={`/${lang}/contracts?domain=${key}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="text-3xl mb-2">{domainIcons[key]}</div>
                    <CardTitle>{lang === "ar" ? domain.ar : domain.fr}</CardTitle>
                    <CardDescription>
                      {count} {lang === "ar" ? "نموذج" : "modèle"}{count > 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
