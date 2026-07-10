"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";

export function Navbar({ messages }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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
            {lang === "ar" ? "النماذج" : "Templates"}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive("/pricing")
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {lang === "ar" ? "الأسعار" : "Pricing"}
          </Link>
          <Link
            href={`/${lang}/resources`}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {lang === "ar" ? "المصادر" : "Resources"}
          </Link>
          <Link
            href={`/${lang}/enterprise`}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {lang === "ar" ? "المؤسسات" : "Enterprise"}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={`/${lang}/login`}
            className="text-sm font-semibold text-primary hover:text-primary-container transition-colors px-3 py-2"
          >
            {lang === "ar" ? "دخول" : "Login"}
          </Link>
          <Link
            href={`/${lang}/signup`}
            className="text-sm font-semibold text-on-primary bg-primary hover:bg-surface-tint transition-colors px-4 py-2 rounded-lg shadow-sm"
          >
            {lang === "ar" ? "اشتراك" : "Sign Up"}
          </Link>
          <Link href={switchPath} className="text-xs text-text-secondary hover:text-on-surface transition-colors ms-1">
            {otherLang === "ar" ? "العربية" : "FR"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface border-b border-border-slate px-4 pb-4 pt-2 space-y-3">
          <Link
            href={`/${lang}/contracts`}
            className="block text-sm font-medium text-on-surface-variant hover:text-primary py-2"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "ar" ? "النماذج" : "Templates"}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className="block text-sm font-medium text-on-surface-variant hover:text-primary py-2"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "ar" ? "الأسعار" : "Pricing"}
          </Link>
          <div className="flex gap-2 pt-2">
            <Link
              href={`/${lang}/login`}
              className="text-sm font-semibold text-primary border border-primary rounded-lg px-4 py-2 flex-1 text-center"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "ar" ? "دخول" : "Login"}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="text-sm font-semibold text-on-primary bg-primary rounded-lg px-4 py-2 flex-1 text-center"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "ar" ? "اشتراك" : "Sign Up"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
