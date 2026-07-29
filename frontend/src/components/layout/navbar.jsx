"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const lang = pathname.startsWith("/ar") ? "ar" : "fr";
  const otherLang = lang === "ar" ? "fr" : "ar";
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);
  const isV2 = pathname.includes("/v2");
  const homeLink = isV2 ? `/${lang}/v2` : `/${lang}`;

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border-slate h-14">
      <div className="max-w-container-max mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        <Link href={homeLink} className="text-lg font-bold text-primary tracking-tight shrink-0">
          Contraty
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/v2`}
            className="text-[10px] font-bold text-on-primary bg-primary px-2 py-0.5 rounded-md hover:bg-surface-tint transition-colors"
          >
            V2
          </Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container"
            aria-label={lang === "ar" ? "بحث" : "Rechercher"}
          >
            <Search size={18} />
          </button>
          <Link
            href={switchPath}
            className="text-xs text-text-secondary hover:text-on-surface transition-colors font-medium"
          >
            {otherLang === "ar" ? "العربية" : "FR"}
          </Link>
        </div>
      </div>

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
                  const q = encodeURIComponent(e.target.value);
                  window.location.href = isV2 ? `/${lang}/v2#templates` : `/${lang}/contracts?q=${q}`;
                }
              }}
            />
            <button onClick={() => setSearchOpen(false)} className="text-text-secondary hover:text-on-surface">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
