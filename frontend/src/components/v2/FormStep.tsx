"use client";

import { ArrowLeft, ArrowRight, AlertCircle, Check } from "lucide-react";
import type { FieldMeta } from "@/types";
import { validateField } from "@/lib/constants";
import { getInputType } from "@/lib/utils";

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
    <div className="max-w-2xl mx-auto">
      {/* Section breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary">
          {field.sectionTitle}
        </span>
        <span className="text-xs text-text-secondary">·</span>
        <span className="text-xs text-text-secondary">
          {lang === "ar" ? `سؤال ${fieldIndex + 1} من ${totalFields}` : `Question ${fieldIndex + 1} sur ${totalFields}`}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-primary-fixed/20 rounded-2xl p-6 md:p-8 mb-4">
        <div className="flex items-start gap-3 mb-1">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold text-on-surface leading-snug">
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
          <p className="text-sm text-text-secondary leading-relaxed mb-5 mt-2">{help}</p>
        )}
      </div>

      {/* Answer area */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-5 md:p-6 mb-4">
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
          <p className="text-sm text-error mt-3 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {msg[error] || error}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-on-surface transition-colors px-4 py-3 rounded-xl hover:bg-surface-container"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === "ar" ? "رجوع" : "Retour"}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 text-base"
        >
          {confirmLabel}
          {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
