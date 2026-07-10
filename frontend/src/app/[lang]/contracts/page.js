import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { fetchTemplates } from "@/lib/constants";
import { DOMAINS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ContractsPage({ params, searchParams }) {
  const { lang } = params;
  const domain = searchParams?.domain;
  const msg = getMessages(lang);
  const templates = await fetchTemplates({ domain, language: lang });

  const domainName = domain && DOMAINS[domain] ? (lang === "ar" ? DOMAINS[domain].ar : DOMAINS[domain].fr) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">
        {domainName || (lang === "ar" ? "جميع العقود" : "Tous les contrats")}
      </h1>
      <p className="text-muted-foreground mb-8">
        {templates.length} {lang === "ar" ? "نموذج" : "modèle"}{templates.length > 1 ? "s" : ""} {lang === "ar" ? "متاح" : "disponible"}{templates.length > 1 ? "s" : ""}
      </p>

      {!domain && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/${lang}/contracts`}>
            <Button variant="outline" size="sm" className="font-bold">
              {lang === "ar" ? "الكل" : "Tous"}
            </Button>
          </Link>
          {Object.entries(DOMAINS).map(([key, dom]) => (
            <Link key={key} href={`/${lang}/contracts?domain=${key}`}>
              <Button variant="ghost" size="sm">
                {lang === "ar" ? dom.ar : dom.fr}
              </Button>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <Card key={t.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">
                {lang === "ar" ? t.title_ar : t.title_fr}
              </CardTitle>
              <CardDescription>
                {msg.contract?.fields || "Champs"}: {t.field_count}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Link href={`/${lang}/generate/${t.slug}`} className="w-full">
                <Button variant="secondary" className="w-full">
                  {msg.contract?.generateThis || "Générer ce contrat"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
