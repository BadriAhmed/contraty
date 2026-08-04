"use client";

import Link from "next/link";
import { getMessages } from "@/lib/i18n";

export function Footer({ lang, disclaimer }) {
  const msg = getMessages(lang);
  const base = `/${lang}`;

  return (
    <footer className="bg-surface-container-high text-on-surface-container">
      <div className="max-w-container-max mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href={base} className="text-lg font-bold text-inverse-on-surface">
              Contraty
            </Link>
            <p className="text-xs text-inverse-on-surface/60 mt-2 leading-relaxed">
              {lang === "ar"
                ? "منصة العقود القانونية التونسية"
                : "La plateforme des contrats juridiques tunisiens"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "نماذج" : "Modèles"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "سكن" : "Logement"}
              </Link>
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "عمل" : "Travail"}
              </Link>
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "مؤسسة" : "Entreprise"}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "روابط" : "Liens"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "كل النماذج" : "Tous les modèles"}
              </Link>
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "قانوني" : "Légal"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              <p className="leading-relaxed">{disclaimer || msg.disclaimer}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-inverse-on-surface/10 pt-6 text-center">
          <p className="text-xs text-inverse-on-surface/50">
            © {new Date().getFullYear()} Contraty — {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"}
          </p>
        </div>
      </div>
    </footer>
  );
}
