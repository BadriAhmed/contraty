"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, validateField } from "@/lib/constants";
import { useWizardState, useTemplateData } from "@/lib/useWizard";
import { useContractGeneration } from "@/lib/useGeneration";
import { Lock, X, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import DisclaimerStep from "@/components/generate/DisclaimerStep";
import FormStep from "@/components/generate/FormStep";
import ExtraNotesStep from "@/components/generate/ExtraNotesStep";
import PreviewStep from "@/components/generate/PreviewStep";
import type { Template, ContractWarning } from "@/types";

export default function GeneratePage() {
  const params = useParams();
  const lang = (params.lang as string) || "fr";
  const type = params.type as string;
  const isRtl = lang === "ar";

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    fieldValues,
    setFieldValues,
    currentStep,
    setCurrentStep,
    disclaimerAccepted,
    setDisclaimerAccepted,
    fieldErrors,
    setFieldErrors,
    extraNotes,
    setExtraNotes,
    editingField,
    setEditingField,
    inlineValue,
    setInlineValue,
    clearPersistence,
    handleFieldChange,
  } = useWizardState(type, lang);

  const { meta, steps } = useTemplateData(template, lang);

  const totalSteps = steps.length + 2;
  const {
    generating,
    generated,
    setGenerated,
    error: genError,
    setError: setGenError,
    appliedSuggestions,
    setAppliedSuggestions,
    loadingStep,
    loadingMsgs,
    handleGenerate,
    handleDownload,
    handleApplySuggestion,
  } = useContractGeneration(type, lang, fieldValues, extraNotes, clearPersistence);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) {
          setFetchError("Template not found");
          setLoading(false);
          return;
        }
        setTemplate(t);
        setLoading(false);
      })
      .catch((e) => {
        setFetchError(e instanceof Error ? e.message : "Template not found");
        setLoading(false);
      });
  }, [type]);

  const isDisclaimerStep = currentStep === 0;
  const isExtraNotesStep = currentStep === steps.length + 1;
  const isPreviewStep = currentStep > steps.length + 1;
  const currentSection = !isDisclaimerStep && !isExtraNotesStep && !isPreviewStep ? steps[currentStep - 1] : null;

  const handleBlur = (field: { name: string; metadata: ReturnType<typeof meta> }) => {
    const value = fieldValues[field.name] || "";
    const err = validateField(value, field.metadata);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[field.name] = err;
      else delete next[field.name];
      return next;
    });
  };

  const handleNext = () => {
    if (isDisclaimerStep) {
      if (!disclaimerAccepted) {
        setGenError(lang === "ar" ? "يجب الموافقة على إخلاء المسؤولية" : "Vous devez accepter l'avertissement légal");
        return;
      }
      setGenError(null);
      setCurrentStep((s) => s + 1);
      return;
    }

    if (isExtraNotesStep) {
      handleGenerate(false, steps.length, setCurrentStep);
      return;
    }

    const newErrors: Record<string, string> = {};
    let errorCount = 0;
    for (const f of currentSection?.fields || []) {
      if (!f.metadata?.required) continue;
      const err = validateField(fieldValues[f.name] || "", f.metadata);
      if (err) {
        newErrors[f.name] = err;
        errorCount++;
      }
    }
    if (errorCount > 0) {
      setFieldErrors(newErrors);
      setGenError(
        lang === "ar" ? `يرجى تصحيح ${errorCount} حقول` : `${errorCount} champ(s) à corriger`,
      );
      return;
    }
    setGenError(null);
    setFieldErrors({});
    setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    setGenError(null);
    setFieldErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
    setGenerated(null);
  };

  const handleApplySuggestionWrapper = (warning: ContractWarning) => {
    const val = handleApplySuggestion(warning);
    if (val && warning.field) {
      setFieldValues((prev) => ({ ...prev, [warning.field]: val }));
      setAppliedSuggestions((prev) => new Set([...prev, `${warning.field}:${val}`]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError && !template) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">
          {lang === "ar" ? "خطأ" : "Erreur"}
        </h1>
        <p className="text-text-secondary">{fetchError}</p>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template?.title_ar : template?.title_fr;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-surface border-b border-border-slate px-4 md:px-8 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}`} className="text-lg font-bold text-primary">
            Contraty
          </Link>
          <span className="w-px h-4 bg-border-slate" />
          <span className="text-sm text-text-secondary truncate max-w-[200px]">{title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Lock size={12} className="text-success-green" />
            {lang === "ar" ? "جلسة آمنة" : "Session sécurisée"}
          </span>
          <Link href={`/${lang}`} className="flex items-center gap-1 text-error hover:text-error/80">
            <X size={14} />
            {lang === "ar" ? "خروج" : "Quitter"}
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-xl font-bold text-on-surface mb-1">
          {lang === "ar" ? "إنشاء عقد" : "Créer un contrat"} : {title}
        </h1>
        <p className="text-sm text-text-secondary mb-8">{template?.legal_basis}</p>

        {!isPreviewStep && (
          <div className={`flex items-center justify-center mb-10 ${isRtl ? "flex-row-reverse" : ""}`}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < currentStep
                      ? "bg-primary text-on-primary"
                      : i === currentStep
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container-highest border border-outline-variant text-on-surface-variant opacity-60"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle2 size={14} />
                  ) : i === 0 ? (
                    <ShieldAlert size={14} />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-12 md:w-20 h-0.5 transition-colors ${
                      i < currentStep ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-border-slate shadow-sm p-6 md:p-8">
          {isPreviewStep && generated ? (
            <PreviewStep
              lang={lang}
              type={type}
              title={title || ""}
              generated={generated}
              appliedSuggestions={appliedSuggestions}
              generating={generating}
              onApplySuggestion={handleApplySuggestionWrapper}
              onEditField={setEditingField}
              onSaveInline={(fieldName) => {
                setFieldValues((prev) => ({ ...prev, [fieldName]: inlineValue }));
                setAppliedSuggestions((prev) => new Set([...prev, `accept:${fieldName}:manual`]));
                setEditingField(null);
              }}
              onSetApplied={setAppliedSuggestions}
              onRegenerate={() => handleGenerate(true, steps.length, setCurrentStep)}
              onDownload={handleDownload}
              onBack={handlePrevious}
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
              onNext={handleNext}
            />
          ) : isExtraNotesStep ? (
            <ExtraNotesStep
              lang={lang}
              type={type}
              extraNotes={extraNotes}
              generating={generating}
              error={genError}
              loadingMsg={loadingMsgs[loadingStep] || loadingMsgs[0]}
              onNotesChange={setExtraNotes}
              onGenerate={() => handleGenerate(false, steps.length, setCurrentStep)}
              onPrevious={handlePrevious}
            />
          ) : (
            <FormStep
              lang={lang}
              section={
                currentSection
                  ? {
                      title: currentSection.title,
                      sectionId: currentSection.sectionId,
                      fields: currentSection.fields,
                    }
                  : null
              }
              fieldValues={fieldValues}
              fieldErrors={fieldErrors}
              error={genError}
              isFirst={currentStep <= 1}
              onFieldChange={handleFieldChange}
              onBlur={handleBlur}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </div>
      </div>
    </div>
  );
}
