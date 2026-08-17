"use client";

import { useParams } from "next/navigation";

export default function Error({ error }) {
  const params = useParams();
  const lang = params?.lang || "fr";

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {lang === "ar" ? "حدث خطأ" : "Une erreur est survenue"}
        </h2>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          {error?.message || (lang === "ar" ? "يرجى المحاولة مرة أخرى" : "Veuillez réessayer")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20"
        >
          {lang === "ar" ? "إعادة المحاولة" : "Réessayer"}
        </button>
      </div>
    </div>
  );
}
