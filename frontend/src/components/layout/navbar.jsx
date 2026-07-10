"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar({ messages }) {
  const pathname = usePathname();
  const lang = pathname.startsWith("/ar") ? "ar" : "fr";
  const otherLang = lang === "ar" ? "fr" : "ar";

  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="font-bold text-xl text-primary">
            Contraty
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href={`/${lang}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {messages.nav?.home || "Accueil"}
            </Link>
            <Link
              href={`/${lang}/contracts`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {messages.nav?.contracts || "Contrats"}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href={switchPath}>
            <Button variant="outline" size="sm">
              {messages.nav?.language || (lang === "ar" ? "Français" : "العربية")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
