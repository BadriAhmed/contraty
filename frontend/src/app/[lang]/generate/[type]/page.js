"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, API_BASE } from "@/lib/constants";
import { Lock, ArrowRight, ArrowLeft, CheckCircle2, Download, FileText, Loader2, X, AlertCircle, ShieldAlert } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PATTERNS = {
  cin: /^\d{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+216)?\s?\d[\d\s]{6,10}$/,
  date: /^(\d{4}-\d{2}-\d{2}|\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4})$/,
  number: /^-?\d+([.,]\d+)?$/,
  percentage: /^\d{1,3}([.,]\d+)?$/,
};

const STORAGE_KEY = "contraty_wizard";

function getInputType(ftype) {
  switch (ftype) {
    case "email": return "email";
    case "number":
    case "percentage": return "number";
    case "date": return "date";
    default: return "text";
  }
}

function validateField(value, meta) {
  if (!meta) return null;
  const trimmed = (value || "").trim();
  if (meta.required && !trimmed) return "required";
  if (trimmed && meta.pattern) {
    try { const re = new RegExp(meta.pattern); if (!re.test(trimmed)) return "pattern"; } catch {}
  }
  if (trimmed && meta.type && PATTERNS[meta.type]) {
    if (!PATTERNS[meta.type].test(trimmed)) return "format";
  }
  if (trimmed && meta.min_length && trimmed.length < meta.min_length) return "min_length";
  if (trimmed && meta.max_length && trimmed.length > meta.max_length) return "max_length";
  if (trimmed && (meta.type === "number" || meta.type === "percentage")) {
    const n = parseFloat(trimmed.replace(",", "."));
    if (isNaN(n)) return "format";
    if (meta.min_value !== undefined && meta.min_value !== null && n < meta.min_value) return "min_value";
    if (meta.max_value !== undefined && meta.max_value !== null && n > meta.max_value) return "max_value";
  }
  return null;
}

function formatDate(iso) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return iso;
}

const ERROR_MSG = {
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

const LOADING_STEPS = {
  ar: ["جاري إنشاء العقد...", "جاري المراجعة بالذكاء الاصطناعي...", "اكتمل!"],
  fr: ["Génération du contrat...", "Révision par l'IA...", "Terminé !"],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GeneratePage() {
  const params = useParams();
  const { lang, type } = params;
  const isRtl = lang === "ar";
  const msg = ERROR_MSG[lang];
  const loadingMsgs = LOADING_STEPS[lang];

  const [template, setTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldValues, setFieldValues] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [extraNotes, setExtraNotes] = useState("");
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [loadingStep, setLoadingStep] = useState(0);
  const initialLoadDone = useRef(false);

  /* ---------- localStorage persistence ---------- */
  useEffect(() => {
    if (initialLoadDone.current) return;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${type}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fieldValues) setFieldValues(parsed.fieldValues);
        if (parsed.extraNotes) setExtraNotes(parsed.extraNotes);
        if (parsed.disclaimerAccepted) setDisclaimerAccepted(true);
      }
    } catch {}
    initialLoadDone.current = true;
  }, [type]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}_${type}`, JSON.stringify({
        fieldValues, extraNotes, disclaimerAccepted,
      }));
    } catch {}
  }, [fieldValues, extraNotes, disclaimerAccepted, type]);

  /* ---------- Loading step animation ---------- */
  useEffect(() => {
    if (!generating) { setLoadingStep(0); return; }
    const t1 = setTimeout(() => setLoadingStep(1), 800);
    const t2 = setTimeout(() => setLoadingStep(2), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [generating]);

  /* ---------- Fetch template ---------- */
  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) { setError("Template not found"); setLoading(false); return; }
        setTemplate(t);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [type]);

  const meta = useCallback((fieldName) => template?.field_metadata?.[fieldName] || null, [template]);

  /* ---------- Field grouping ---------- */
  const fieldsBySection = useMemo(() => {
    if (!template?.sections) return [];
    const seen = new Set();
    const sections = [];
    for (const section of template.sections) {
      const secFields = [];
      for (const article of section.articles || []) {
        for (const field of article.fields || []) {
          if (!seen.has(field)) {
            seen.add(field);
            const md = meta(field);
            secFields.push({
              name: field,
              label: lang === "ar" ? (md?.label_ar || field) : (md?.label_fr || field.replace(/[\[\]]/g, "").replace(/_/g, " ")),
              placeholder: lang === "ar" ? (md?.placeholder_ar || "") : (md?.placeholder_fr || ""),
              metadata: md,
            });
          }
        }
      }
      if (secFields.length > 0) {
        sections.push({
          id: section.id,
          title: lang === "ar" ? section.title_ar : section.title_fr,
          fields: secFields,
        });
      }
    }
    return sections;
  }, [template, lang, meta]);

  const steps = useMemo(() => {
    const s = [];
    for (const sec of fieldsBySection) {
      const maxPer = sec.fields.length <= 6 ? sec.fields.length : 6;
      for (let i = 0; i < sec.fields.length; i += maxPer) {
        s.push({
          title: i === 0 ? sec.title : `${sec.title} (${lang === "ar" ? "تابع" : "suite"})`,
          sectionId: sec.id,
          fields: sec.fields.slice(i, i + maxPer),
        });
      }
    }
    return s;
  }, [fieldsBySection, lang]);

  /* ---------- Step logic ---------- */
  // Step layout: 0=disclaimer, 1..N=fields, N+1=extra notes, >N+1=preview
  const totalSteps = steps.length + 2; // disclaimer + fields + notes
  const isDisclaimerStep = currentStep === 0;
  const isExtraNotesStep = currentStep === steps.length + 1;
  const isPreviewStep = currentStep > steps.length + 1;
  const currentSection = !isDisclaimerStep && !isExtraNotesStep && !isPreviewStep
    ? steps[currentStep - 1]
    : null;

  const handleBlur = (field) => {
    const value = fieldValues[field.name] || "";
    const err = validateField(value, field.metadata);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[field.name] = err; else delete next[field.name];
      return next;
    });
  };

  const handleNext = () => {
    if (isDisclaimerStep) {
      if (!disclaimerAccepted) {
        setError(lang === "ar" ? "يجب الموافقة على إخلاء المسؤولية" : "Vous devez accepter l'avertissement légal");
        return;
      }
      setError(null);
      setCurrentStep((s) => s + 1);
      return;
    }

    if (isExtraNotesStep) {
      handleGenerate();
      return;
    }

    const newErrors = {};
    let errorCount = 0;
    for (const f of currentSection?.fields || []) {
      if (!f.metadata?.required) continue;
      const err = validateField(fieldValues[f.name] || "", f.metadata);
      if (err) { newErrors[f.name] = err; errorCount++; }
    }

    if (errorCount > 0) {
      setFieldErrors(newErrors);
      setError(lang === "ar" ? `يرجى تصحيح ${errorCount} حقول` : `${errorCount} champ(s) à corriger`);
      return;
    }

    setError(null);
    setFieldErrors({});
    setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    setError(null);
    setFieldErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
    setGenerated(null);
  };

  const handleApplySuggestion = (warning) => {
    if (warning.suggested_value && warning.field) {
      setFieldValues((prev) => ({ ...prev, [warning.field]: warning.suggested_value }));
      setAppliedSuggestions((prev) => new Set([...prev, `${warning.field}:${warning.suggested_value}`]));
    }
  };

  const handleGenerate = async (skipReview = false) => {
    setGenerating(true);
    setError(null);
    try {
      // Clear saved form on success
      localStorage.removeItem(`${STORAGE_KEY}_${type}`);
      const res = await fetch(`${API_BASE}/contracts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          user_fields: fieldValues,
          review: !skipReview,
          skip_review: skipReview,
          extra_notes: extraNotes,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Generation failed");
      const data = await res.json();
      setGenerated(data);
      setCurrentStep(steps.length + 2);
      setAppliedSuggestions(new Set());
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (format) => {
    if (!generated?.contract) return;
    try {
      const endpoint = format === "docx" ? "generate/docx" : "generate/pdf";
      const res = await fetch(`${API_BASE}/contracts/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          contract_json: generated.contract,
        }),
      });
      if (!res.ok) throw new Error(`${format} failed`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${type}-${lang}.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  };

  /* ---------- Render ---------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
        <p className="text-text-secondary">{error}</p>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template?.title_ar : template?.title_fr;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Wizard header */}
      <div className="bg-surface border-b border-border-slate px-4 md:px-8 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}`} className="text-lg font-bold text-primary">Contraty</Link>
          <span className="w-px h-4 bg-border-slate" />
          <span className="text-sm text-text-secondary truncate max-w-[200px]">{title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Lock size={12} className="text-success-green" />
            {lang === "ar" ? "جلسة آمنة" : "Session sécurisée"}
          </span>
          <Link href={`/${lang}`} className="flex items-center gap-1 text-error hover:text-error/80">
            <X size={14} />{lang === "ar" ? "خروج" : "Quitter"}
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-xl font-bold text-on-surface mb-1">
          {lang === "ar" ? "إنشاء عقد" : "Créer un contrat"} : {title}
        </h1>
        <p className="text-sm text-text-secondary mb-8">{template?.legal_basis}</p>

        {/* Progress stepper — RTL-aware */}
        {!isPreviewStep && (
          <div className={`flex items-center justify-center mb-10 ${isRtl ? "flex-row-reverse" : ""}`}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < currentStep ? "bg-primary text-on-primary" : i === currentStep ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-highest border border-outline-variant text-on-surface-variant opacity-60"
                }`}>
                  {i < currentStep ? <CheckCircle2 size={14} /> : i === 0 ? <ShieldAlert size={14} /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 transition-colors ${i < currentStep ? "bg-primary" : "bg-surface-container-highest"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-border-slate shadow-sm p-6 md:p-8">
          {/* ---------- PREVIEW ---------- */}
          {isPreviewStep && generated ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 bg-success-light border border-success-green/20 rounded-lg px-4 py-3">
                <CheckCircle2 size={20} className="text-success-green" />
                <div>
                  <p className="text-sm font-semibold text-success-green">
                    {lang === "ar" ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès!"}
                  </p>
                  {generated.review_time_ms > 0 && (
                    <p className="text-xs text-text-secondary">
                      {lang === "ar" ? `تمت المراجعة في ${(generated.review_time_ms / 1000).toFixed(1)}s` : `Révisé en ${(generated.review_time_ms / 1000).toFixed(1)}s`}
                    </p>
                  )}
                </div>
              </div>

              {/* Warnings + apply suggestions */}
              {generated.warnings?.length > 0 && (
                <div className="border border-cat-family/40 rounded-lg bg-cat-family/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-cat-family" />
                    <span className="text-sm font-semibold text-on-surface">
                      {lang === "ar" ? "مراجعة" : "Révision"} ({generated.warnings.length})
                    </span>
                  </div>
                  {generated.warnings.map((w, i) => {
                    const applied = appliedSuggestions.has(`${w.field}:${w.suggested_value}`);
                    return (
                      <div key={i} className={`text-sm p-3 rounded-lg ${w.severity === "error" ? "bg-error/10 border border-error/20" : "bg-cat-family/10 border border-cat-family/20"}`}>
                        <div className="flex items-start gap-2">
                          <AlertCircle size={14} className={w.severity === "error" ? "text-error shrink-0 mt-0.5" : "text-cat-family shrink-0 mt-0.5"} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-on-surface">{lang === "ar" ? w.message_ar : w.message_fr}</p>
                            <p className="text-xs text-text-secondary mt-1">{lang === "ar" ? w.suggestion_ar : w.suggestion_fr}</p>
                            {w.suggested_value && (
                              <div className="flex items-center gap-2 mt-2">
                                {applied ? (
                                  <span className="text-xs text-success-green font-medium flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    {lang === "ar" ? `تم التطبيق: ${w.suggested_value}` : `Appliqué : ${w.suggested_value}`}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleApplySuggestion(w)}
                                    className="text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                                  >
                                    {lang === "ar"
                                      ? `تطبيق: ${w.suggested_value}`
                                      : `Appliquer: ${w.suggested_value}`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {appliedSuggestions.size > 0 && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleGenerate(true)}
                        disabled={generating}
                        className="flex items-center gap-2 bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:bg-surface-tint transition-colors disabled:opacity-50 text-sm"
                      >
                        {generating && <Loader2 size={14} className="animate-spin" />}
                        {lang === "ar" ? "إعادة الإنشاء مع التصحيحات" : "Régénérer avec les corrections"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Contract preview — dates formatted to Tunisian style */}
              <div className="bg-surface border border-border-slate rounded-lg paper-shadow p-6 max-h-[500px] overflow-y-auto space-y-4">
                <h2 className="text-lg font-bold text-primary text-center mb-4">{title}</h2>
                {(generated.contract?.sections || []).map((section) => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-primary border-b border-border-slate pb-1 mb-2">
                      {lang === "ar" ? section.title_ar : section.title_fr}
                    </h3>
                    {(section.articles || []).map((article) => {
                      const rawText = lang === "ar" ? article.text_ar : article.text_fr;
                      const displayText = rawText.replace(/\b(\d{4}-\d{2}-\d{2})\b/g, (m) => formatDate(m));
                      return (
                        <p key={article.id} className="text-sm text-on-surface leading-relaxed mb-2 whitespace-pre-wrap">
                          {displayText}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => handleDownload("pdf")} className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-4 rounded-lg hover:bg-surface-tint transition-colors shadow-sm">
                  <Download size={16} />
                  PDF
                </button>
                <button onClick={() => handleDownload("docx")} className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-3 px-4 rounded-lg hover:bg-primary-fixed transition-colors">
                  <FileText size={16} />
                  Word
                </button>
              </div>

              <button onClick={handlePrevious} className="text-sm text-text-secondary hover:text-primary transition-colors">
                {isRtl ? "→" : "←"} {lang === "ar" ? "العودة للنموذج" : "Retour au formulaire"}
              </button>
            </div>

          /* ---------- DISCLAIMER (step 0) ---------- */
          ) : isDisclaimerStep ? (
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <ShieldAlert size={24} className="text-error shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">
                    {lang === "ar" ? "إخلاء مسؤولية قانونية" : "Avertissement légal"}
                  </h3>
                  <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
                    <p>
                      {lang === "ar"
                        ? "النماذج المقدمة على منصة كونتراتي هي نماذج إرشادية لم يراجعها محامٍ. لا تشكل استشارة قانونية ولا تغني عن مراجعة مختص."
                        : "Les modèles fournis sur la plateforme Contraty sont des modèles indicatifs qui n'ont pas été révisés par un avocat. Ils ne constituent pas un conseil juridique et ne remplacent pas la consultation d'un professionnel du droit."}
                    </p>
                    <p>
                      {lang === "ar"
                        ? "تقع مسؤولية التحقق من ملاءمة العقد لحالتك الخاصة عليك وحدك. يُنصح بشدة بمراجعة العقد من قبل محامٍ قبل استخدامه."
                        : "Il est de votre seule responsabilité de vérifier l'adéquation du contrat à votre situation particulière. Il est fortement recommandé de faire relire le contrat par un avocat avant utilisation."}
                    </p>
                    {template?.disclaimer && (
                      <p className="text-xs opacity-75 border-t border-border-slate pt-3">{template.disclaimer}</p>
                    )}
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 bg-surface rounded-lg border border-outline-variant/50">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border-slate text-primary focus:ring-primary"
                />
                <span className="text-sm text-on-surface">
                  {lang === "ar"
                    ? "أقر بأنني فهمت هذا الإخلاء وأتحمل كامل المسؤولية عن استخدام العقد المُنشأ."
                    : "Je reconnais avoir pris connaissance de cet avertissement et assume l'entière responsabilité de l'utilisation du contrat généré."}
                </span>
              </label>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex gap-3 pt-4 border-t border-border-slate">
                <button
                  onClick={handleNext}
                  disabled={!disclaimerAccepted}
                  className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 ms-auto"
                >
                  {lang === "ar" ? "متابعة" : "Continuer"}<ArrowRight size={16} />
                </button>
              </div>
            </div>

          /* ---------- EXTRA NOTES (last step before generate) ---------- */
          ) : isExtraNotesStep ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">
                  {lang === "ar" ? "ملاحظات إضافية" : "Remarques supplémentaires"}
                </h3>
                <p className="text-xs text-text-secondary mb-3">
                  {lang === "ar"
                    ? "أي تفاصيل أخرى تود إضافتها للعقد؟ (اختياري)"
                    : "Des détails supplémentaires à ajouter au contrat ? (optionnel)"}
                </p>
                <textarea
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  rows={4}
                  className="input-field min-h-[100px]"
                  placeholder={lang === "ar" ? "مثال: أريد إضافة شرط يمنع تربية الحيوانات في المسكن..." : "Ex: Je souhaite ajouter une clause interdisant les animaux dans le logement..."}
                />
              </div>

              {generating && (
                <div className="flex flex-col items-center gap-2 py-4 animate-pulse">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <p className="text-sm text-text-secondary">{loadingMsgs[loadingStep] || loadingMsgs[0]}</p>
                </div>
              )}

              {error && (
                <p className="text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />{error}
                </p>
              )}

              <div className="flex gap-3 pt-4 border-t border-border-slate">
                <button onClick={handlePrevious} className="flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-fixed transition-colors">
                  <ArrowLeft size={16} />{lang === "ar" ? "السابق" : "Retour"}
                </button>
                <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 ms-auto">
                  {generating && <Loader2 size={16} className="animate-spin" />}
                  {generating
                    ? (loadingMsgs[loadingStep] || loadingMsgs[0])
                    : lang === "ar" ? "إنشاء العقد" : "Générer le contrat"}<ArrowRight size={16} />
                </button>
              </div>
            </div>

          /* ---------- FORM (field steps 1..N) ---------- */
          ) : (
            <div>
              {currentSection && (
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-4 pb-2 border-b border-border-slate">
                    {currentSection.title}
                  </h3>
                  <div className="space-y-5">
                    {(currentSection.fields || []).map((field) => {
                      const errKey = fieldErrors[field.name];
                      const hasError = !!errKey;
                      const md = field.metadata;
                      const inputType = md ? getInputType(md.type) : "text";
                      const help = lang === "ar" ? (md?.help_ar || "") : (md?.help_fr || "");

                      return (
                        <div key={field.name}>
                          <label className="block mb-1.5">
                            <span className="text-sm font-medium text-on-surface">
                              {field.label}
                              {md?.required !== false && <span className="text-error ms-0.5">*</span>}
                            </span>
                            {md?.hint_ar && lang === "ar" && <span className="text-xs text-text-secondary ms-1">({md.hint_ar})</span>}
                            {md?.hint_fr && lang === "fr" && <span className="text-xs text-text-secondary ms-1">({md.hint_fr})</span>}
                          </label>
                          {help && (
                            <p className="text-xs text-text-secondary mb-1.5 leading-relaxed">{help}</p>
                          )}
                          <input
                            type={inputType}
                            value={fieldValues[field.name] || ""}
                            onChange={(e) => { setFieldValues((prev) => ({ ...prev, [field.name]: e.target.value })); setFieldErrors((prev) => { const n = { ...prev }; delete n[field.name]; return n; }); }}
                            onBlur={() => handleBlur(field)}
                            placeholder={inputType === "date" ? undefined : field.placeholder}
                            className={`input-field ${hasError ? "border-error focus:ring-error" : ""}`}
                          />
                          {hasError && (
                            <p className="text-xs text-error mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />{msg[errKey] || errKey}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-error mt-4 flex items-center gap-1">
                  <AlertCircle size={14} />{error}
                </p>
              )}

              <div className="flex gap-3 pt-6 border-t border-border-slate mt-6">
                {currentStep > 1 && (
                  <button onClick={handlePrevious} className="flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-fixed transition-colors">
                    <ArrowLeft size={16} />{lang === "ar" ? "السابق" : "Retour"}
                  </button>
                )}
                <button onClick={handleNext} className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm ms-auto">
                  {lang === "ar" ? "التالي" : "Suivant"}<ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
