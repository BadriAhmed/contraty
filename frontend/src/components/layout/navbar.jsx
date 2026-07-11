"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";

export function Navbar({ messages }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lang = pathname.startsWith("/ar") ? "ar" : "fr";
  const otherLang = lang === "ar" ? "fr" : "ar";
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const isActive = (path) => {
    const base = `/${lang}${path}`;
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border-slate h-16">
      <div className="max-w-container-max mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link href={`/${lang}`} className="text-xl font-bold text-primary tracking-tight shrink-0">
          Contraty
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href={`/${lang}/contracts`}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive("/contracts")
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {lang === "ar" ? "النماذج" : "Modèles"}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive("/pricing")
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {lang === "ar" ? "الأسعار" : "Tarifs"}
          </Link>
          <Link
            href={`/${lang}/resources`}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive("/resources")
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {lang === "ar" ? "المصادر" : "Ressources"}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container"
            aria-label={lang === "ar" ? "بحث" : "Rechercher"}
          >
            <Search size={18} />
          </button>
          <Link
            href={`/${lang}/login`}
            className="text-sm font-semibold text-primary hover:text-primary-container transition-colors px-3 py-2"
          >
            {lang === "ar" ? "دخول" : "Connexion"}
          </Link>
          <Link
            href={`/${lang}/signup`}
            className="text-sm font-semibold text-on-primary bg-primary hover:bg-surface-tint transition-colors px-4 py-2 rounded-lg shadow-sm"
          >
            {lang === "ar" ? "اشتراك" : "Inscription"}
          </Link>
          <Link href={switchPath} className="text-xs text-text-secondary hover:text-on-surface transition-colors ms-1 font-medium">
            {otherLang === "ar" ? "العربية" : "FR"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label={lang === "ar" ? "بحث" : "Rechercher"}
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-on-surface-variant hover:text-on-surface"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search bar — slides down */}
      {searchOpen && (
        <div className="border-t border-border-slate bg-surface px-4 py-3">
          <div className="max-w-container-max mx-auto flex items-center gap-2">
            <Search size={16} className="text-text-secondary shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder={lang === "ar" ? "ابحث عن نموذج..." : "Rechercher un modèle..."}
              className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-text-secondary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/${lang}/contracts?q=${encodeURIComponent(e.target.value)}`;
                }
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-text-secondary hover:text-on-surface"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface border-b border-border-slate px-4 pb-4 pt-2 space-y-3">
          <Link
            href={`/${lang}/contracts`}
            className="block text-sm font-medium text-on-surface-variant hover:text-primary py-2"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "ar" ? "النماذج" : "Modèles"}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className="block text-sm font-medium text-on-surface-variant hover:text-primary py-2"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "ar" ? "الأسعار" : "Tarifs"}
          </Link>
          <div className="flex gap-2 pt-2">
            <Link
              href={`/${lang}/login`}
              className="text-sm font-semibold text-primary border border-primary rounded-lg px-4 py-2 flex-1 text-center"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "ar" ? "دخول" : "Connexion"}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="text-sm font-semibold text-on-primary bg-primary rounded-lg px-4 py-2 flex-1 text-center"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "ar" ? "اشتراك" : "Inscription"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
