"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, Check, Eye, CalendarCheck, Info, X } from "lucide-react";
import type { FieldMeta } from "@/types";
import { validateField } from "@/lib/constants";
import { getInputType } from "@/lib/utils";
import TransliterateChip from "@/components/v2/TransliterateChip";
import AutocompleteInput from "@/components/v2/AutocompleteInput";
import { fetchVehicles, type VehicleBrand } from "@/lib/vehicles";
import { fetchReference, yearOptions, type ReferenceKind } from "@/lib/reference";

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
  relatedValues?: Record<string, string>;
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
  relatedValues = {},
}: Props) {
  const isRtl = lang === "ar";
  const msg = ERROR_MSG[lang] || ERROR_MSG.fr;
  const md = field.metadata;
  const inputType = md ? getInputType(md.type) : "text";
  const inputMode = md?.type === "cin" ? "numeric" : md?.type === "phone" ? "tel" : undefined;
  const help = lang === "ar" ? md?.help_ar || "" : md?.help_fr || "";
  const isSelect = md?.type === "select";
  const options = isSelect ? (lang === "ar" ? md?.options_ar || [] : md?.options_fr || []) : [];
  const isLastField = fieldIndex === totalFields - 1;
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const isDate = inputType === "date";
  const isBirthdate = field.name.toUpperCase().includes("NAISSANCE");

  const todayStr = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  };

  // Focus without scrolling — the page container handles its own scroll reset
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const isAutocomplete = !!md?.autocomplete;
  const isVehicleField = md?.autocomplete === "vehicle-brand" || md?.autocomplete === "vehicle-model";
  const [catalog, setCatalog] = useState<VehicleBrand[]>([]);
  const [reference, setReference] = useState<{ fr: string[]; ar: string[] } | null>(null);
  useEffect(() => {
    if (isVehicleField) {
      fetchVehicles().then(setCatalog);
    }
  }, [isVehicleField]);
  useEffect(() => {
    if (!isVehicleField && md?.autocomplete && md.autocomplete !== "years") {
      fetchReference(md.autocomplete as ReferenceKind).then(setReference);
    }
  }, [isVehicleField, md?.autocomplete]);

  const acOptions = useMemo(() => {
    if (!isAutocomplete) return [];
    if (md?.autocomplete === "years") return yearOptions();
    if (md?.autocomplete === "vehicle-brand") {
      return catalog.map((b) => b.brand).sort();
    }
    if (md?.autocomplete === "vehicle-model") {
      const brandValue = (relatedValues.MARQUE || "").trim();
      const brand = catalog.find((b) => b.brand.toLowerCase() === brandValue.toLowerCase());
      const models = brand ? brand.models : catalog.flatMap((b) => b.models);
      return Array.from(new Set(models)).sort();
    }
    if (reference) {
      return (lang === "ar" ? reference.ar : reference.fr) || [];
    }
    return [];
  }, [catalog, reference, isAutocomplete, md?.autocomplete, relatedValues.MARQUE, lang]);

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
          {md?.image && (
            <button
              type="button"
              onClick={() => setShowImage((s) => !s)}
              aria-label={lang === "ar" ? "مساعدة" : "Aide"}
              title={lang === "ar" ? "فين نلقاها؟" : "Où le trouver ?"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                showImage
                  ? "bg-primary text-on-primary shadow-md shadow-primary/25"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <Info size={18} />
            </button>
          )}
        </div>
        {help && (
          <p className="text-sm text-text-secondary leading-relaxed mt-2">{help}</p>
        )}
        {md?.image && showImage && (
          <div className="mt-3 bg-surface rounded-xl border border-outline-variant/40 p-2">
            <button
              type="button"
              onClick={() => setShowLightbox(true)}
              aria-label={lang === "ar" ? "تكبير الصورة" : "Agrandir l'image"}
              className="block w-full cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={md.image}
                alt={lang === "ar" ? "صورة توضيحية" : "Illustration d'aide"}
                className="w-full max-w-sm mx-auto rounded-lg"
              />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && md?.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setShowLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={md.image}
            alt={lang === "ar" ? "صورة توضيحية" : "Illustration d'aide"}
            className="max-h-[90vh] max-w-[92vw] w-auto h-auto rounded-xl shadow-2xl cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            aria-label={lang === "ar" ? "إغلاق" : "Fermer"}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Answer area */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-4 md:p-5 lg:p-6 mb-3 md:mb-4">
        {isAutocomplete ? (
          <AutocompleteInput
            value={value || ""}
            options={acOptions}
            placeholder={field.placeholder}
            onChange={onChange}
          />
        ) : isSelect ? (
          <select
            ref={inputRef as React.Ref<HTMLSelectElement>}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field text-base rounded-xl"
          >
            <option value="">{field.placeholder || (lang === "ar" ? "اختر..." : "Sélectionner...")}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="flex items-start gap-2">
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type={inputType}
              inputMode={inputMode}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isDate ? undefined : field.placeholder}
              className="input-field text-base rounded-xl flex-1 min-w-0"
            />
            {isDate && !isBirthdate && (
              <button
                type="button"
                onClick={() => onChange(todayStr())}
                className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary border-2 border-primary rounded-xl px-3.5 py-3 hover:bg-primary-fixed transition-colors"
              >
                <CalendarCheck size={15} />
                {lang === "ar" ? "اليوم" : "Aujourd'hui"}
              </button>
            )}
          </div>
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
          {confirmLabel}
          {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
