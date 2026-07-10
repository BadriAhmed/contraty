import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { fetchTemplate } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ContractDetailPage({ params }) {
  const { lang, type } = params;
  const msg = getMessages(lang);
  const template = await fetchTemplate(type);

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          {lang === "ar" ? "العقد غير موجود" : "Contrat introuvable"}
        </h1>
        <Link href={`/${lang}/contracts`}>
          <Button variant="outline" className="mt-4">
            {lang === "ar" ? "العودة للقائمة" : "Retour à la liste"}
          </Button>
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href={`/${lang}/contracts`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        &larr; {lang === "ar" ? "العقود" : "Contrats"}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>
            {lang === "ar" ? "النطاق" : "Domaine"}: {template.domain} &middot;{" "}
            {msg.contract?.fields || "Champs"}: {template.field_count}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href={`/${lang}/generate/${template.slug}`}>
            <Button className="w-full" size="lg">
              {msg.contract?.generateThis || "Générer ce contrat"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
