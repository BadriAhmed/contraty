import Link from "next/link";

export default async function NotFound({ params }) {
  const resolved = params ? await params : {};
  const lang = resolved?.lang || "fr";

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl md:text-7xl font-extrabold text-primary/20 mb-2">404</p>
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page introuvable"}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {lang === "ar"
            ? "ربما تم نقل الصفحة أو لم تعد موجودة"
            : "La page a peut-être été déplacée ou n'existe plus"}
        </p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20"
        >
          {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    </div>
  );
}
