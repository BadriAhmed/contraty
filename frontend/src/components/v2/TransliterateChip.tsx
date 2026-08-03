"use client";

import { Sparkles } from "lucide-react";

interface Props {
  lang: string;
  value: string;
}

function hasLatinChars(text: string): boolean {
  return /[a-zA-Z]{2,}/.test(text);
}

export default function TransliterateChip({ lang, value }: Props) {
  if (lang !== "ar") return null;

  const trimmed = (value || "").trim();
  if (!trimmed || !hasLatinChars(trimmed)) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/5 border border-primary/15 px-2.5 py-1.5 rounded-lg mt-2">
      <Sparkles size={12} />
      سيتم تحويل النص إلى العربية تلقائياً عند المراجعة
    </span>
  );
}
