import Link from "next/link";
import { getMessages } from "@/lib/i18n";

export function Footer({ lang, disclaimer }) {
  const msg = getMessages(lang);

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-auto">
      <div className="max-w-container-max mx-auto px-4 py-12">
        {/* Disclaimer */}
        <div className="border border-error/30 rounded-lg bg-error/10 p-4 mb-10">
          <p className="text-xs text-error font-semibold leading-relaxed">
            {disclaimer || msg.site?.disclaimer}
          </p>
        </div>

        {/* Links + brand */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <Link href={`/${lang}`} className="text-lg font-bold text-inverse-on-surface">
              Contraty
            </Link>
            <p className="text-sm text-on-secondary-fixed-variant mt-2 max-w-xs">
              {lang === "ar"
                ? "عقود قانونية تونسية ثنائية اللغة — أنشئ عقدك في دقائق"
                : "Contrats juridiques tunisiens bilingues — créez votre contrat en quelques minutes"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "نماذج" : "Modèles"}</h4>
            <div className="space-y-2 text-sm text-on-secondary-fixed-variant">
              <Link href={`/${lang}/contracts?domain=logement`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "سكن" : "Logement"}
              </Link>
              <Link href={`/${lang}/contracts?domain=travail`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "عمل" : "Travail"}
              </Link>
              <Link href={`/${lang}/contracts?domain=entreprise`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "مؤسسة" : "Entreprise"}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "الشركة" : "Société"}</h4>
            <div className="space-y-2 text-sm text-on-secondary-fixed-variant">
              <Link href={`/${lang}/about`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "من نحن" : "À propos"}
              </Link>
              <Link href={`/${lang}/pricing`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "الأسعار" : "Tarifs"}
              </Link>
              <Link href={`/${lang}/contact`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "اتصل بنا" : "Contact"}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "قانوني" : "Légal"}</h4>
            <div className="space-y-2 text-sm text-on-secondary-fixed-variant">
              <Link href={`/${lang}/terms`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "شروط الاستخدام" : "Conditions"}
              </Link>
              <Link href={`/${lang}/privacy`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "الخصوصية" : "Confidentialité"}
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-on-secondary-fixed/20 pt-6 text-center text-xs text-on-secondary-fixed-variant">
          &copy; {new Date().getFullYear()} Contraty. {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés."}
        </div>
      </div>
    </footer>
  );
}
