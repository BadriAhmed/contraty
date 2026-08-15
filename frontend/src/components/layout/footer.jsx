"use client";

import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { DOMAINS } from "@/lib/constants";

const COMPANY_NAME = "Imarisys";
const COMPANY_URL = "https://imarisys.com/";
const COMPANY_EMAIL = "contact@imarisys.com";

export function Footer({ lang, disclaimer }) {
  const msg = getMessages(lang);
  const base = `/${lang}`;
  const legal = disclaimer || msg?.site?.disclaimer || "";

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand + parent company */}
          <div>
            <Link href={base} className="text-lg font-bold">
              Contraty
            </Link>
            <p className="text-xs text-inverse-on-surface/60 mt-2 leading-relaxed">
              {lang === "ar"
                ? "منصة العقود القانونية التونسية"
                : "La plateforme des contrats juridiques tunisiens"}
            </p>
            <p className="text-xs text-inverse-on-surface/60 mt-4">
              {lang === "ar" ? "من إنجاز" : "Une réalisation de"}{" "}
              <a
                href={COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-inverse-on-surface hover:underline"
              >
                {COMPANY_NAME}
              </a>
            </p>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="block text-xs text-inverse-on-surface/60 hover:underline mt-1"
            >
              {COMPANY_EMAIL}
            </a>
          </div>

          {/* Domaines */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "المجالات" : "Domaines"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              {Object.entries(DOMAINS).map(([key, domain]) => (
                <Link
                  key={key}
                  href={`${base}?domain=${key}#templates`}
                  className="block hover:text-inverse-on-surface transition-colors"
                >
                  {lang === "ar" ? domain.ar : domain.fr}
                </Link>
              ))}
            </div>
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "روابط" : "Liens"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "كل النماذج" : "Tous les modèles"}
              </Link>
              <Link href={`${base}#templates`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
              </Link>
              <a href={`mailto:${COMPANY_EMAIL}`} className="block hover:text-inverse-on-surface transition-colors">
                {lang === "ar" ? "اتصل بنا" : "Contact"}
              </a>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "قانوني" : "Légal"}</h4>
            <div className="space-y-2 text-sm text-inverse-on-surface/60">
              <p className="leading-relaxed">{legal}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-inverse-on-surface/10 pt-6 text-center">
          <p className="text-xs text-inverse-on-surface/50">
            © {new Date().getFullYear()} Contraty — {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"} ·{" "}
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {COMPANY_NAME}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
