import Link from "next/link";
import { ShieldCheck, Lock, Scale, Mail, Globe } from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const isAr = params.lang === "ar";
  return {
    title: isAr ? "إشعارات قانونية والخصوصية" : "Mentions légales & confidentialité",
    robots: { index: true, follow: true },
  };
}

const COMPANY = {
  name: "Imarisys",
  url: "https://imarisys.com/",
  email: "contact@imarisys.com",
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Scale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="text-sm text-text-secondary leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function LegalPage({ params }: { params: { lang: string } }) {
  const lang = params.lang === "ar" ? "ar" : "fr";
  const isAr = lang === "ar";
  const base = `/${lang}`;

  return (
    <div className="bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <Link href={base} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
          {isAr ? "→ الرئيسية" : "← Accueil"}
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-8">
          {isAr ? "إشعارات قانونية والخصوصية" : "Mentions légales & confidentialité"}
        </h1>

        <Section
          icon={Scale}
          title={isAr ? "إخلاء المسؤولية" : "Avertissement légal"}
        >
          <p>
            {isAr
              ? "النماذج المقدمة على هذه المنصة إرشادية ولم يراجعها محامٍ، ولا تشكل استشارة قانونية. قبل استخدام أي عقد، يُنصح بمراجعته لدى محامٍ مختص بالتشريع التونسي."
              : "Les modèles fournis sur cette plateforme sont indicatifs et n'ont pas été révisés par un avocat. Ils ne constituent pas un conseil juridique. Avant d'utiliser un contrat, il est recommandé de le faire vérifier par un avocat spécialisé en droit tunisien."}
          </p>
        </Section>

        <Section icon={Lock} title={isAr ? "الخصوصية والبيانات" : "Confidentialité & données"}>
          <p>
            {isAr
              ? "تتم عملية إنشاء العقد داخل الجلسة فقط. لا يتم تخزين بياناتك ولا تُنشأ أي حسابات. بمجرد تحميل العقد، تُحذف بياناتك."
              : "La génération du contrat se fait uniquement en session. Aucune donnée n'est conservée et aucun compte n'est créé. Une fois le contrat téléchargé, vos données sont effacées."}
          </p>
        </Section>

        <Section icon={ShieldCheck} title={isAr ? "الناشر" : "Éditeur"}>
          <p>
            {isAr ? "هذه المنصة من إنجاز" : "Cette plateforme est une réalisation de"}{" "}
            <a
              href={COMPANY.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              {COMPANY.name}
            </a>
            .
          </p>
          <p className="flex items-center gap-2">
            <Globe size={14} className="text-text-secondary shrink-0" />
            <a href={COMPANY.url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
              {COMPANY.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </p>
        </Section>

        <Section icon={Mail} title={isAr ? "اتصل بنا" : "Contact"}>
          <p>
            {isAr ? "لأي استفسار، يمكنكم مراسلتنا على:" : "Pour toute question, vous pouvez nous écrire à :"}{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-primary font-semibold hover:underline">
              {COMPANY.email}
            </a>
          </p>
        </Section>

        <p className="text-xs text-text-secondary/70 pt-4 border-t border-border-slate">
          © {new Date().getFullYear()} Contraty · {COMPANY.name}
        </p>
      </div>
    </div>
  );
}
