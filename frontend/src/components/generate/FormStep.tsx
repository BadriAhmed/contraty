"use client";

import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import type { FieldMeta } from "@/types";
import { validateField } from "@/lib/constants";
import { getInputType } from "@/lib/utils";

const ERROR_MSG: Record<string, Record<string, string>> = {
  ar: {
    required: "هذا الحقل مطلوب",
    pattern: "الصيغة غير صالحة",
    format: "الصيغة غير صالحة",
    min_length: "النص قصير جدًا",
    max_length: "النص طويل جدًا",
    min_value: "القيمة صغيرة جدًا",
    max_value: "القيمة كبيرة جدًا",
  },
  fr: {
    required: "Ce champ est obligatoire",
    pattern: "Format invalide",
    format: "Format invalide",
    min_length: "Texte trop court",
    max_length: "Texte trop long",
    min_value: "Valeur trop petite",
    max_value: "Valeur trop grande",
  },
};

interface SectionField {
  name: string;
  label: string;
  placeholder: string;
  metadata: FieldMeta | null;
}

interface Props {
  lang: string;
  section: { title: string; sectionId: string; fields: SectionField[] } | null;
  fieldValues: Record<string, string>;
  fieldErrors: Record<string, string>;
  error: string | null;
  isFirst: boolean;
  onFieldChange: (name: string, value: string) => void;
  onBlur: (field: SectionField) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function FormStep({
  lang,
  section,
  fieldValues,
  fieldErrors,
  error,
  isFirst,
  onFieldChange,
  onBlur,
  onNext,
  onPrevious,
}: Props) {
  const msg = ERROR_MSG[lang] || ERROR_MSG.fr;

  if (!section) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-4 pb-2 border-b border-border-slate">
        {section.title}
      </h3>
      <div className="space-y-5">
        {(section.fields || []).map((field) => {
          const errKey = fieldErrors[field.name];
          const hasError = !!errKey;
          const md = field.metadata;
          const inputType = md ? getInputType(md.type) : "text";
          const help = lang === "ar" ? md?.help_ar || "" : md?.help_fr || "";

          return (
            <div key={field.name}>
              <label className="block mb-1.5">
                <span className="text-sm font-medium text-on-surface">
                  {field.label}
                  {md?.required !== false && <span className="text-error ms-0.5">*</span>}
                </span>
                {inputType !== "date" && md?.hint_ar && lang === "ar" && (
                  <span className="text-xs text-text-secondary ms-1">({md.hint_ar})</span>
                )}
                {inputType !== "date" && md?.hint_fr && lang === "fr" && (
                  <span className="text-xs text-text-secondary ms-1">({md.hint_fr})</span>
                )}
              </label>
              {help && <p className="text-xs text-text-secondary mb-1.5 leading-relaxed">{help}</p>}
              <input
                type={inputType}
                value={fieldValues[field.name] || ""}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                onBlur={() => onBlur(field)}
                placeholder={inputType === "date" ? undefined : field.placeholder}
                className={`input-field ${hasError ? "border-error focus:ring-error" : ""}`}
              />
              {hasError && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {msg[errKey] || errKey}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-error mt-4 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-6 border-t border-border-slate mt-6">
        {!isFirst && (
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-fixed transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === "ar" ? "السابق" : "Retour"}
          </button>
        )}
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm ms-auto"
        >
          {lang === "ar" ? "التالي" : "Suivant"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
