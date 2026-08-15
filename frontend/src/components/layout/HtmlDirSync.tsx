"use client";

import { useEffect } from "react";

/**
 * Mirrors the active locale onto the <html> element so that lang/dir are
 * correct for accessibility, SEO, and RTL scrollbar/base direction. The root
 * layout has no access to the [lang] segment, so this runs as a client effect.
 */
export default function HtmlDirSync({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
