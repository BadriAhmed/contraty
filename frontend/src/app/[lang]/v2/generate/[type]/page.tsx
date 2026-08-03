"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, validateField } from "@/lib/constants";
import { useWizardState } from "@/lib/useWizard";
import { useContractGeneration } from "@/lib/useGeneration";
import { getInputType } from "@/lib/utils";
import { Lock, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ProgressBar from "@/components/v2/ProgressBar";
import SummarySidebar from "@/components/v2/SummarySidebar";
import DisclaimerStep from "@/components/v2/DisclaimerStep";
import FormStep from "@/components/v2/FormStep";
import ExtraNotesStep from "@/components/v2/ExtraNotesStep";
import PreviewStep from "@/components/v2/PreviewStep";
import LoadingWithAd from "@/components/v2/LoadingWithAd";
import type { Template, ContractWarning, FieldMeta } from "@/types";

export default function V2GeneratePage() {
  const params = useParams();
  const lang = (params.lang as string) || "fr";
  const type = params.type as string;
  const isRtl = lang === "ar";

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showAdLoading, setShowAdLoading] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const {
    fieldValues, setFieldValues, currentStep, setCurrentStep,
    disclaimerAccepted, setDisclaimerAccepted, fieldErrors, setFieldErrors,
    extraNotes, setExtraNotes, editingField, setEditingField,
    inlineValue, setInlineValue, clearPersistence, handleFieldChange,
  } = useWizardState(type, lang);

  const {
    generating, generated, setGenerated, error: genError, setError: setGenError,
    appliedSuggestions, setAppliedSuggestions, loadingStep, loadingMsgs,
    handleGenerate, handleDownload, handleApplySuggestion,
  } = useContractGeneration(type, lang, fieldValues, extraNotes, clearPersistence);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) { setFetchError("Template not found"); setLoading(false); return; }
        setTemplate(t); setLoading(false);
      })
      .catch((e) => { setFetchError(e instanceof Error ? e.message : "Template not found"); setLoading(false); });
  }, [type]);

  // Flatten all fields into a single array with section info
  const flatFields = useMemo(() => {
    if (!template?.sections) return [];
    const seen = new Set<string>();
    const fields: Array<{
      name: string;
      label: string;
      placeholder: string;
      metadata: FieldMeta | null;
      sectionTitle: string;
      sectionId: string;
    }> = [];
    for (const section of template.sections) {
      const secTitle = lang === "ar" ? section.title_ar : section.title_fr;
      for (const article of section.articles || []) {
        for (const fieldName of article.fields || []) {
          if (!seen.has(fieldName)) {
            seen.add(fieldName);
            const md = template.field_metadata?.[fieldName] || null;
            fields.push({
              name: fieldName,
              label: lang === "ar"
                ? (md?.label_ar || fieldName)
                : (md?.label_fr || fieldName.replace(/_/g, " ")),
              placeholder: lang === "ar" ? (md?.placeholder_ar || "") : (md?.placeholder_fr || ""),
              metadata: md,
              sectionTitle: secTitle,
              sectionId: section.id,
            });
          }
        }
      }
    }
    return fields;
  }, [template, lang]);

  // Build section summary for sidebar
  const sidebarSections = useMemo(() => {
    if (!template?.sections) return [];
    const seen = new Set<string>();
    const sections: Array<{
      id: string;
      title: string;
      fields: Array<{ name: string; label: string; metadata: FieldMeta | null }>;
    }> = [];
    for (const section of template.sections) {
      const secTitle = lang === "ar" ? section.title_ar : section.title_fr;
      const secFields: typeof sections[number]["fields"] = [];
      for (const article of section.articles || []) {
        for (const fieldName of article.fields || []) {
          if (!seen.has(fieldName)) {
            seen.add(fieldName);
            const md = template.field_metadata?.[fieldName] || null;
            secFields.push({
              name: fieldName,
              label: lang === "ar" ? (md?.label_ar || fieldName) : (md?.label_fr || fieldName.replace(/_/g, " ")),
              metadata: md,
            });
          }
        }
      }
      if (secFields.length > 0) {
        sections.push({ id: section.id, title: secTitle, fields: secFields });
      }
    }
    return sections;
  }, [template, lang]);

  const totalFields = flatFields.length;
  // Step model: 0=disclaimer, 1..N=fields, N+1=notes, N+2=preview
  const totalSteps = totalFields + 3;

  const isDisclaimerStep = currentStep === 0;
  const isNotesStep = currentStep === totalFields + 1;
  const isPreviewStep = currentStep > totalFields + 1;
  const fieldIndex = currentStep - 1; // 0-indexed field when 1 <= currentStep <= totalFields
  const isFormStep = currentStep >= 1 && currentStep <= totalFields;
  const currentField = isFormStep ? flatFields[fieldIndex] : null;

  const progressPercent = isPreviewStep ? 100 : Math.round((currentStep / (totalFields + 2)) * 100);

  const answeredTotal = flatFields.filter((f) => (fieldValues[f.name] || "").trim() !== "").length;

  const handleConfirm = () => {
    if (!currentField) return;
    const md = currentField.metadata;
    if (md?.required !== false) {
      const err = validateField(fieldValues[currentField.name] || "", md);
      if (err) {
        setFieldErrors((prev) => ({ ...prev, [currentField.name]: err }));
        return;
      }
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[currentField.name];
      return next;
    });
    setGenError(null);
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setGenError(null);
    setFieldErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
    if (isPreviewStep) setGenerated(null);
  };

  const handleJumpTo = (idx: number) => {
    setCurrentStep(idx + 1);
    setGenError(null);
    setFieldErrors({});
  };

  const handleGenerateWithAd = () => {
    setShowAdLoading(true);
    handleGenerate(false, totalFields + 1, setCurrentStep);
  };

  const handleAdComplete = () => setShowAdLoading(false);

  const handleApplySuggestionWrapper = (warning: ContractWarning) => {
    const val = handleApplySuggestion(warning);
    if (val && warning.field) {
      setFieldValues((prev) => ({ ...prev, [warning.field]: val }));
      setAppliedSuggestions((prev) => new Set([...prev, `${warning.field}:${val}`]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError && !template) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
        <p className="text-text-secondary">{fetchError}</p>
        <Link href={`/${lang}/v2`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template?.title_ar : template?.title_fr;
  const homeLink = `/${lang}/v2`;
  const detailLink = `/${lang}/v2/contracts/${type}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top nav */}
      <div className="bg-surface border-b border-border-slate shrink-0">
        <div className="px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={homeLink} className="text-lg font-bold text-primary tracking-tight">Contraty</Link>
            <span className="w-px h-4 bg-border-slate" />
            <Link href={detailLink} className="text-sm text-text-secondary truncate max-w-[200px] hover:text-primary transition-colors">{title}</Link>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="hidden sm:flex items-center gap-1">
              <Lock size={12} className="text-success-green" />
              {lang === "ar" ? "جلسة آمنة" : "Session sécurisée"}
            </span>
            <Link href={homeLink} className="flex items-center gap-1 text-error hover:text-error/80 transition-colors">
              <X size={14} />
              {lang === "ar" ? "إغلاق" : "Quitter"}
            </Link>
          </div>
        </div>
        {/* Progress bar */}
        {!isPreviewStep && (
          <div className="px-4 md:px-8 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar percent={progressPercent} />
              </div>
              <span className="text-xs font-medium text-text-secondary tabular-nums">{progressPercent}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-nav: back button + breadcrumb */}
      {!isDisclaimerStep && !isPreviewStep && (
        <div className="px-4 md:px-8 py-3 border-b border-border-slate/50 bg-surface/50">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-on-surface transition-colors">
            {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {lang === "ar" ? "رجوع" : "Retour"}
          </button>
        </div>
      )}

      {/* Main content: sidebar + question area */}
      <div className="flex-1 flex">
        {/* Sidebar (desktop only, during form steps) */}
        {isFormStep && (
          <aside className="hidden lg:flex flex-col w-[380px] shrink-0 bg-surface-container-low/60 border-e-2 border-primary/10 overflow-y-auto">
            <div className="p-6">
              <SummarySidebar
                lang={lang}
                sections={sidebarSections}
                fieldValues={fieldValues}
                currentFieldIndex={fieldIndex}
                onJumpTo={handleJumpTo}
              />
            </div>
          </aside>
        )}

        {/* Main area */}
        <div className={`flex-1 overflow-y-auto ${isFormStep ? "pb-24 lg:pb-0" : ""}`}>
          <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-12">
            {isPreviewStep && generated ? (
              <PreviewStep
                lang={lang}
                title={title || ""}
                generated={generated}
                appliedSuggestions={appliedSuggestions}
                generating={generating}
                onApplySuggestion={handleApplySuggestionWrapper}
                onEditField={(fieldName) => {
                  setEditingField(fieldName);
                  setInlineValue(fieldValues[fieldName] || "");
                }}
                onSaveInline={(fieldName) => {
                  setFieldValues((prev) => ({ ...prev, [fieldName]: inlineValue }));
                  setAppliedSuggestions((prev) => new Set([...prev, `corrected:${fieldName}`]));
                  setEditingField(null);
                  setInlineValue("");
                }}
                onSetApplied={setAppliedSuggestions}
                onRegenerate={() => handleGenerate(true, totalFields + 1, setCurrentStep)}
                onDownload={handleDownload}
                onBack={handleBack}
                editingField={editingField}
                inlineValue={inlineValue}
                setInlineValue={setInlineValue}
                setEditingField={setEditingField}
              />
            ) : isDisclaimerStep ? (
              <DisclaimerStep
                lang={lang}
                disclaimerAccepted={disclaimerAccepted}
                templateDisclaimer={template?.disclaimer}
                error={genError}
                onAccept={setDisclaimerAccepted}
                onNext={() => { setGenError(null); setCurrentStep((s) => s + 1); }}
              />
            ) : isNotesStep ? (
              showAdLoading ? (
                <LoadingWithAd lang={lang} isReady={!generating} onComplete={handleAdComplete} />
              ) : (
                <ExtraNotesStep
                  lang={lang}
                  type={type}
                  extraNotes={extraNotes}
                  generating={generating}
                  error={genError}
                  loadingMsg={loadingMsgs[loadingStep] || loadingMsgs[0]}
                  onNotesChange={setExtraNotes}
                  onGenerate={handleGenerateWithAd}
                  onPrevious={handleBack}
                />
              )
            ) : isFormStep && currentField ? (
              <FormStep
                lang={lang}
                field={currentField}
                fieldIndex={fieldIndex}
                totalFields={totalFields}
                value={fieldValues[currentField.name] || ""}
                error={fieldErrors[currentField.name] || null}
                isFirstField={fieldIndex === 0}
                onChange={(value) => handleFieldChange(currentField.name, value)}
                onConfirm={handleConfirm}
                onBack={handleBack}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile: sticky bottom progress bar */}
      {isFormStep && (
        <div className="lg:hidden fixed bottom-0 start-0 end-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-border-slate/60 px-4 py-2.5 safe-bottom">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="w-full flex items-center gap-3"
          >
            <span className="flex-1 h-1.5 rounded-full bg-outline-variant/40 overflow-hidden">
              <span
                className="block h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </span>
            <span className="text-xs font-medium text-text-secondary tabular-nums whitespace-nowrap">
              {answeredTotal}/{totalFields} · {progressPercent}%
            </span>
          </button>
        </div>
      )}

      {/* Mobile: sidebar modal */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          showMobileSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
        <div
          className={`absolute bottom-0 start-0 end-0 max-h-[85vh] bg-surface-container-lowest rounded-t-3xl overflow-hidden shadow-2xl transition-transform duration-300 ${
            showMobileSidebar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-outline-variant" />
          </div>
          <div className="flex items-center justify-between px-5 pb-3 border-b border-border-slate/50">
            <span className="font-semibold text-sm">
              {lang === "ar" ? "التقدم" : "Progression"} · {progressPercent}%
            </span>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <X size={14} className="text-text-secondary" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(85vh-72px)] p-4">
            <SummarySidebar
              lang={lang}
              sections={sidebarSections}
              fieldValues={fieldValues}
              currentFieldIndex={fieldIndex}
              onJumpTo={(idx) => {
                handleJumpTo(idx);
                setShowMobileSidebar(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
