"use client";

import { ArrowLeft, ArrowRight, AlertCircle, Check } from "lucide-react";
import type { FieldMeta } from "@/types";
import { validateField } from "@/lib/constants";
import { getInputType } from "@/lib/utils";
import TransliterateChip from "@/components/v2/TransliterateChip";

const ERROR_MSG: Record<string, Record<string, string>> = {
  ar: {
    required: "هذا الحقل مطلوب",
    pattern: "الصيغة غير صالحة",
    format: "الصيغة غير صالحة",
    min_length: "النص أقصر من الحد الأدنى المطلوب",
    max_length: "النص يتجاوز الطول المسموح به",
    min_value: "القيمة أقل من الحد الأدنى المسموح به",
    max_value: "القيمة تتجاوز الحد الأقصى المسموح به",
  },
  fr: {
    required: "Ce champ est obligatoire",
    pattern: "Format invalide",
    format: "Format invalide",
    min_length: "Texte trop court",
    max_length: "Texte trop long",
    min_value: "Valeur inférieure au minimum requis",
    max_value: "Valeur supérieure au maximum autorisé",
  },
};

interface FieldInfo {
  name: string;
  label: string;
  placeholder: string;
  metadata: FieldMeta | null;
  sectionTitle: string;
}

interface Props {
  lang: string;
  field: FieldInfo;
  fieldIndex: number;
  totalFields: number;
  value: string;
  error: string | null;
  isFirstField: boolean;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function FormStep({
  lang,
  field,
  fieldIndex,
  totalFields,
  value,
  error,
  isFirstField,
  onChange,
  onConfirm,
  onBack,
}: Props) {
  const isRtl = lang === "ar";
  const msg = ERROR_MSG[lang] || ERROR_MSG.fr;
  const md = field.metadata;
  const inputType = md ? getInputType(md.type) : "text";
  const help = lang === "ar" ? md?.help_ar || "" : md?.help_fr || "";
  const isSelect = md?.type === "select";
  const options = isSelect ? (lang === "ar" ? md?.options_ar || [] : md?.options_fr || []) : [];
  const isLastField = fieldIndex === totalFields - 1;

  const confirmLabel = isLastField
    ? (lang === "ar" ? "متابعة إلى المراجعة" : "Continuer vers les notes")
    : (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputType !== "textarea") {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <div className="w-full">
      {/* Section breadcrumb */}
      <div className="mb-3 md:mb-4 flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary truncate max-w-[180px] sm:max-w-none">
          {field.sectionTitle}
        </span>
        <span className="text-xs text-text-secondary hidden sm:inline">·</span>
        <span className="text-xs text-text-secondary hidden sm:inline">
          {lang === "ar" ? `سؤال ${fieldIndex + 1} من ${totalFields}` : `Question ${fieldIndex + 1} sur ${totalFields}`}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-primary-fixed/20 rounded-2xl p-4 md:p-6 lg:p-8 mb-3 md:mb-4">
        <div className="flex items-start gap-3 mb-1">
          <div className="flex-1">
            <h2 className="text-base md:text-lg lg:text-xl font-bold text-on-surface leading-snug">
              {field.label}
              {md?.required !== false && <span className="text-error ms-1">*</span>}
            </h2>
            {inputType !== "date" && md?.hint_fr && lang === "fr" && (
              <span className="text-xs text-text-secondary">({md.hint_fr})</span>
            )}
            {inputType !== "date" && md?.hint_ar && lang === "ar" && (
              <span className="text-xs text-text-secondary">({md.hint_ar})</span>
            )}
          </div>
        </div>
        {help && (
          <p className="text-sm text-text-secondary leading-relaxed mt-2">{help}</p>
        )}
      </div>

      {/* Answer area */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-4 md:p-5 lg:p-6 mb-3 md:mb-4">
        {isSelect ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="input-field text-base rounded-xl"
          >
            <option value="">{field.placeholder || (lang === "ar" ? "اختر..." : "Sélectionner...")}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {}}
            placeholder={inputType === "date" ? undefined : field.placeholder}
            autoFocus
            className="input-field text-base rounded-xl"
          />
        )}

        {error && (
          <p className="text-sm text-error mt-2 md:mt-3 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {msg[error] || error}
          </p>
        )}

        <TransliterateChip lang={lang} value={value || ""} />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-on-surface transition-colors px-3 py-3 md:px-4 rounded-xl hover:bg-surface-container shrink-0"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span className="hidden sm:inline">{lang === "ar" ? "رجوع" : "Retour"}</span>
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3.5 md:py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 text-sm md:text-base"
        >
          {isLastField
            ? (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer")
            : (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer")}
          {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
