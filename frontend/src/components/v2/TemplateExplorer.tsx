"use client";

import { useState } from "react";
import Link from "next/link";
import { DOMAINS } from "@/lib/constants";
import { Home, Briefcase, Coins, Car, Building2, FileText, ArrowRight, LayoutGrid } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { Template } from "@/types";

const domainMeta: Record<string, { icon: typeof Home; color: string }> = {
  logement: { icon: Home, color: "var(--cat-real-estate)" },
  travail: { icon: Briefcase, color: "var(--cat-employment)" },
  argent: { icon: Coins, color: "var(--cat-family)" },
  vehicules: { icon: Car, color: "var(--cat-services)" },
  entreprise: { icon: Building2, color: "var(--cat-business)" },
  demarches: { icon: FileText, color: "var(--cat-documents)" },
};

interface Props {
  lang: string;
  templates: Template[];
}

export default function TemplateExplorer({ lang, templates }: Props) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = activeDomain
    ? templates.filter((t) => t.domain === activeDomain)
    : templates;

  const visible = showAll || activeDomain ? filtered : filtered.slice(0, 9);
  const hasMore = !showAll && !activeDomain && filtered.length > 9;

  const arCount = (n: number) =>
    n === 1 ? "نموذج" : n === 2 ? "نموذجين" : "نماذج";

  return (
    <section id="templates" className="py-16 md:py-24 bg-surface-container-low/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            {lang === "ar" ? "6 مجالات قانونية" : "6 domaines juridiques"}
          </h2>
          <p className="mt-3 text-text-secondary">
            {lang === "ar"
              ? `${templates.length} نموذجًا تغطي احتياجاتك القانونية`
              : `${templates.length} modèles couvrant vos besoins juridiques`}
          </p>
        </div>

        {/* Domain filter pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-10 px-1">
          <button
            onClick={() => { setActiveDomain(null); setShowAll(false); trackEvent("domain_filter", { domain: "all", lang }); }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeDomain === null
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "bg-surface border border-outline-variant/40 text-on-surface-variant hover:border-primary/30"
            }`}
          >
            <LayoutGrid size={14} className="sm:size-[15px]" />
            {lang === "ar" ? "الكل" : "Tous"}
            <span className={`text-[10px] sm:text-xs ${activeDomain === null ? "text-on-primary/70" : "text-text-secondary"}`}>
              {templates.length}
            </span>
          </button>
          {Object.entries(DOMAINS).map(([key, domain]) => {
            const meta = domainMeta[key];
            if (!meta) return null;
            const count = templates.filter((t) => t.domain === key).length;
            if (count === 0) return null;
            const Icon = meta.icon;
            const isActive = activeDomain === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveDomain(isActive ? null : key); setShowAll(false); trackEvent("domain_filter", { domain: key, lang }); }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "text-on-primary shadow-md"
                    : "bg-surface border border-outline-variant/40 text-on-surface-variant hover:border-transparent hover:shadow-sm"
                }`}
                style={isActive ? { backgroundColor: meta.color } : {}}
              >
                <Icon size={14} className="sm:size-[15px]" style={isActive ? { color: "var(--on-primary)" } : { color: meta.color }} />
                {lang === "ar" ? domain.ar : domain.fr}
                <span className={`text-[10px] sm:text-xs ${isActive ? "text-on-primary/70" : "text-text-secondary"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Template cards grid */}
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary">
              {lang === "ar" ? "لا توجد نماذج في هذا المجال" : "Aucun modèle dans ce domaine"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((tpl) => {
              const dmeta = domainMeta[tpl.domain];
              const TIcon = dmeta?.icon || FileText;
              const tColor = dmeta?.color || "var(--primary)";
              const tTitle = lang === "ar" ? tpl.title_ar : tpl.title_fr;
              const tDesc = lang === "ar" ? (tpl.description_ar || "") : (tpl.description_fr || "");
              const domainName = DOMAINS[tpl.domain]
                ? (lang === "ar" ? DOMAINS[tpl.domain].ar : DOMAINS[tpl.domain].fr)
                : "";
              return (
                <Link
                  key={tpl.slug}
                  href={`/${lang}/contracts/${tpl.slug}`}
                  onClick={() => trackEvent("template_click", { slug: tpl.slug, domain: tpl.domain, lang })}
                  className="group bg-surface rounded-2xl border border-outline-variant/40 p-5 hover:shadow-lg hover:border-transparent transition-all hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in srgb, ${tColor} 12%, transparent)` }}
                    >
                      <TIcon size={20} style={{ color: tColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-on-surface text-sm leading-tight line-clamp-2">
                        {tTitle}
                      </h3>
                      <span className="text-[10px] text-text-secondary">{domainName}</span>
                    </div>
                  </div>
                  {tDesc && (
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3 flex-1">
                      {tDesc}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      {tpl.field_count} {lang === "ar"
                        ? tpl.field_count === 1 ? "حقل" : tpl.field_count === 2 ? "حقلان" : "حقول"
                        : tpl.field_count > 1 ? "champs" : "champ"}
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {lang === "ar" ? "ابدأ" : "Démarrer"}
                      <ArrowRight size={12} className={lang === "ar" ? "rotate-180" : ""} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Show all / Show less */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-primary font-semibold px-6 py-3 rounded-xl border border-primary/30 hover:bg-primary-fixed/40 transition-colors"
            >
              {lang === "ar" ? "عرض كل النماذج" : "Voir tous les modèles"}
              <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
            </button>
          </div>
        )}
        {showAll && !activeDomain && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-2 text-text-secondary font-medium px-6 py-3 rounded-xl hover:bg-surface-container transition-colors text-sm"
            >
              {lang === "ar" ? "عرض أقل" : "Voir moins"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
