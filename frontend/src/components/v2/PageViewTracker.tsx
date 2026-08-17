"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

interface Props {
  lang: string;
}

/** Fire a page_view on every client-side navigation (used for visit metrics). */
export default function PageViewTracker({ lang }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", { lang, path: pathname || "/" });
  }, [pathname, lang]);

  return null;
}
