"use client";

import { useRef, useEffect } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  Coins,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  PenLine,
  Shield,
  CircleDot,
} from "lucide-react";
import type { FieldMeta } from "@/types";

interface SectionInfo {
  id: string;
  title: string;
  fields: Array<{ name: string; label: string; metadata: FieldMeta | null }>;
}

interface Props {
  lang: string;
  sections: SectionInfo[];
  fieldValues: Record<string, string>;
  currentFieldIndex: number;
  onJumpTo: (fieldIndex: number) => void;
}

const SECTION_ICONS = [User, FileText, Coins, Calendar, MapPin, Building2, Briefcase, PenLine, Shield, CircleDot];

function getSectionIcon(index: number) {
  return SECTION_ICONS[index % SECTION_ICONS.length];
}

export default function SummarySidebar({ lang, sections, fieldValues, currentFieldIndex, onJumpTo }: Props) {
  const isRtl = lang === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  let globalIndex = 0;

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const answeredTotal = sections.reduce(
    (acc, s) => acc + s.fields.filter((f) => (fieldValues[f.name] || "").trim() !== "").length,
    0,
  );
  const overallPercent = totalFields > 0 ? Math.round((answeredTotal / totalFields) * 100) : 0;

  // Auto-scroll to current field when it changes — scroll ONLY the sidebar list,
  // never the page (scrollIntoView would scroll every scrollable ancestor)
  useEffect(() => {
    const container = scrollRef.current;
    const el = currentRef.current;
    if (!container || !el) return;
    const elTop =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;
    container.scrollTo({
      top: Math.max(0, elTop - container.clientHeight / 2 + el.clientHeight / 2),
      behavior: "smooth",
    });
  }, [currentFieldIndex]);

  return (
    <div className="sticky top-6">
      {/* Overall progress header */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-t-2xl px-6 py-5 text-on-primary">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold uppercase tracking-wide opacity-80">
            {lang === "ar" ? "التقدم" : "Progression"}
          </span>
          <span className="text-2xl font-bold tabular-nums">{overallPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-on-primary/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-on-primary transition-all duration-500 ease-out"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="text-xs mt-3 opacity-70">
          {answeredTotal} / {totalFields} {lang === "ar" ? "حقل مكتمل" : "champs complétés"}
        </p>
      </div>

      {/* Section list */}
      <div className="bg-surface-container-lowest rounded-b-2xl border border-t-0 border-outline-variant/30 overflow-hidden">
        <div ref={scrollRef} className="max-h-[calc(75vh-100px)] overflow-y-auto">
          {sections.map((section, sIdx) => {
            const sectionFields = section.fields;
            const answeredCount = sectionFields.filter(
              (f) => (fieldValues[f.name] || "").trim() !== "",
            ).length;
            const allAnswered = answeredCount === sectionFields.length && sectionFields.length > 0;
            const Icon = getSectionIcon(sIdx);

            const hasCurrentField = sectionFields.some((_, fi) => globalIndex + fi === currentFieldIndex);
            const sectionColor = allAnswered
              ? "var(--success-green)"
              : hasCurrentField
                ? "var(--primary)"
                : "var(--outline-variant)";

            return (
              <div key={section.id} className={sIdx > 0 ? "border-t-2 border-border-slate/40" : ""}>
                {/* Section header */}
                <div
                  className={`px-5 py-4 flex items-center gap-3 transition-colors ${
                    hasCurrentField ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${sectionColor} 15%, transparent)`,
                    }}
                  >
                    {allAnswered ? (
                      <Check size={20} style={{ color: sectionColor }} />
                    ) : (
                      <Icon size={18} style={{ color: sectionColor }} />
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 truncate ${
                      hasCurrentField ? "font-bold text-primary" : "font-semibold text-on-surface"
                    }`}
                  >
                    {section.title}
                  </span>
                  {/* Mini progress ring */}
                  <div className="relative w-8 h-8 shrink-0">
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="12" fill="none" stroke="var(--outline-variant)" strokeWidth="3" opacity="0.3" />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill="none"
                        stroke={sectionColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(answeredCount / sectionFields.length) * 75.4} 75.4`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-on-surface-variant tabular-nums">
                        {answeredCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Field rows */}
                <div className="pb-2">
                  {sectionFields.map((field) => {
                    const idx = globalIndex++;
                    const value = fieldValues[field.name] || "";
                    const isAnswered = value.trim() !== "";
                    const isCurrent = idx === currentFieldIndex;

                    return (
                      <button
                        key={field.name}
                        ref={isCurrent ? currentRef : undefined}
                        onClick={() => onJumpTo(idx)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-start transition-all group relative ${
                          isCurrent ? "bg-primary/8" : "hover:bg-surface-container"
                        }`}
                      >
                        {/* Active indicator bar */}
                        {isCurrent && (
                          <span className="absolute start-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-e-full bg-primary" />
                        )}

                        {/* Status dot */}
                        <span
                          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                            isAnswered
                              ? "border-success-green bg-success-green"
                              : isCurrent
                                ? "border-primary bg-primary/10"
                                : "border-outline-variant"
                          }`}
                        >
                          {isAnswered ? (
                            <Check size={11} className="text-white" strokeWidth={3} />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          ) : null}
                        </span>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-sm block truncate transition-colors ${
                              isCurrent
                                ? "font-bold text-primary"
                                : isAnswered
                                  ? "text-on-surface"
                                  : "text-on-surface-variant"
                            }`}
                          >
                            {field.label}
                          </span>
                        </div>

                        {/* Answer value — shows live as user types */}
                        {isAnswered && (
                          <span
                            className={`text-xs truncate max-w-[110px] font-medium px-2.5 py-1 rounded-md transition-all ${
                              isCurrent
                                ? "bg-success-green/15 text-success-green border border-success-green/20"
                                : "bg-surface-container text-text-secondary"
                            }`}
                          >
                            {value.length > 16 ? value.slice(0, 16) + "…" : value}
                          </span>
                        )}

                        {/* Chevron */}
                        {isRtl ? (
                          <ChevronLeft
                            size={15}
                            className={`shrink-0 transition-colors ${
                              isCurrent ? "text-primary" : "text-text-secondary/50 group-hover:text-text-secondary"
                            }`}
                          />
                        ) : (
                          <ChevronRight
                            size={15}
                            className={`shrink-0 transition-colors ${
                              isCurrent ? "text-primary" : "text-text-secondary/50 group-hover:text-text-secondary"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
