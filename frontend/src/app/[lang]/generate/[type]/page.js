"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate } from "@/lib/constants";
import { Lock, ArrowRight, ArrowLeft, CheckCircle2, Download, Loader2, X, AlertCircle } from "lucide-react";

const PATTERNS = {
  cin: /^\d{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+216)?\s?\d[\d\s]{6,10}$/,
  date: /^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}$/,
  number: /^-?\d+([.,]\d+)?$/,
  percentage: /^\d{1,3}([.,]\d+)?$/,
};

function getInputType(ftype) {
  switch (ftype) {
    case "email": return "email";
    case "number":
    case "percentage": return "number";
    case "date": return "text";
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

export default function GeneratePage() {
  const params = useParams();
  const { lang, type } = params;
  const isRtl = lang === "ar";
  const msg = ERROR_MSG[lang];

  const [template, setTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldValues, setFieldValues] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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

  // Collect fields grouped by section — keep sections intact in steps
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

  // Build steps so each section stays together; large sections split into sub-steps
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

  const totalSteps = steps.length + 1; // + disclaimer
  const isDisclaimerStep = currentStep >= steps.length;
  const isPreviewStep = currentStep > steps.length;
  const currentSection = !isDisclaimerStep && !isPreviewStep ? steps[currentStep] : null;

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

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/contracts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          user_fields: fieldValues,
          review: true,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Generation failed");
      const data = await res.json();
      setGenerated(data);
      setCurrentStep(steps.length + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generated?.contract) return;
    try {
      const res = await fetch("http://localhost:8000/api/v1/contracts/generate/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          contract_json: generated.contract,
        }),
      });
      if (!res.ok) throw new Error("PDF failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${type}-${lang}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  };

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

        {/* Progress stepper */}
        {!isPreviewStep && (
          <div className="flex items-center justify-center mb-10">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < currentStep ? "bg-primary text-on-primary" : i === currentStep ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-highest border border-outline-variant text-on-surface-variant opacity-60"
                }`}>
                  {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 transition-colors ${i < currentStep ? "bg-primary" : "bg-surface-container-highest"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-border-slate shadow-sm p-6 md:p-8">
          {/* Preview mode — rendered contract */}
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

              {/* Warnings */}
              {generated.warnings?.length > 0 && (
                <div className="border border-cat-family/40 rounded-lg bg-cat-family/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-cat-family" />
                    <span className="text-sm font-semibold text-on-surface">
                      {lang === "ar" ? "مراجعة" : "Révision"} ({generated.warnings.length})
                    </span>
                  </div>
                  {generated.warnings.map((w, i) => (
                    <div key={i} className={`text-sm p-3 rounded-lg ${w.severity === "error" ? "bg-error/10 border border-error/20" : "bg-cat-family/10 border border-cat-family/20"}`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className={w.severity === "error" ? "text-error shrink-0 mt-0.5" : "text-cat-family shrink-0 mt-0.5"} />
                        <div>
                          <p className="font-medium text-on-surface">{lang === "ar" ? w.message_ar : w.message_fr}</p>
                          <p className="text-xs text-text-secondary mt-1">{lang === "ar" ? w.suggestion_ar : w.suggestion_fr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rendered contract preview */}
              <div className="bg-surface border border-border-slate rounded-lg paper-shadow p-6 max-h-[500px] overflow-y-auto space-y-4">
                <h2 className="text-lg font-bold text-primary text-center mb-4">{title}</h2>
                {(generated.contract?.sections || []).map((section) => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-primary border-b border-border-slate pb-1 mb-2">
                      {lang === "ar" ? section.title_ar : section.title_fr}
                    </h3>
                    {(section.articles || []).map((article) => (
                      <p key={article.id} className="text-sm text-on-surface leading-relaxed mb-2 whitespace-pre-wrap">
                        {lang === "ar" ? article.text_ar : article.text_fr}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-4 rounded-lg hover:bg-surface-tint transition-colors shadow-sm">
                <Download size={16} />
                {lang === "ar" ? "تحميل PDF" : "Télécharger le PDF"}
              </button>

              <button onClick={handlePrevious} className="text-sm text-text-secondary hover:text-primary transition-colors">
                {isRtl ? "→" : "←"} {lang === "ar" ? "العودة للنموذج" : "Retour au formulaire"}
              </button>
            </div>
          ) : isDisclaimerStep ? (
            <div className="space-y-6">
              <div className="border-2 border-error/30 rounded-lg bg-error/5 p-4">
                <h3 className="text-sm font-bold text-error mb-2">
                  {lang === "ar" ? "⚠️ إخلاء مسؤولية قانونية" : "⚠️ Avertissement légal"}
                </h3>
                <p className="text-sm text-on-surface leading-relaxed">
                  {template?.disclaimer || (lang === "ar"
                    ? "النموذج المقدم إرشادي ولم يراجعه محامٍ. لا يشكل استشارة قانونية."
                    : "Le modèle fourni est indicatif et n'a pas été révisé par un avocat. Il ne constitue pas un conseil juridique.")}
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border-slate text-primary focus:ring-primary"
                />
                <span className="text-sm text-on-surface-variant">
                  {lang === "ar"
                    ? "أقر بأن هذا النموذج إرشادي ولم يراجعه محامٍ، وأنه لا يغني عن استشارة قانونية."
                    : "Je reconnais que ce modèle est indicatif, n'a pas été révisé par un avocat, et ne remplace pas une consultation juridique."}
                </span>
              </label>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex gap-3 pt-4 border-t border-border-slate">
                <button onClick={handlePrevious} className="flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-fixed transition-colors">
                  <ArrowLeft size={16} />{lang === "ar" ? "السابق" : "Retour"}
                </button>
                <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50">
                  {generating && <Loader2 size={16} className="animate-spin" />}
                  {lang === "ar" ? "توليد العقد" : "Générer le contrat"}<ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <div>
              {currentSection && (
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-4 pb-2 border-b border-border-slate">
                    {currentSection.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentSection.fields || []).map((field) => {
                      const errKey = fieldErrors[field.name];
                      const hasError = !!errKey;
                      const md = field.metadata;
                      const inputType = md ? getInputType(md.type) : "text";

                      return (
                        <div key={field.name} className={field.label.length > 25 ? "md:col-span-2" : ""}>
                          <label className="label-text flex items-center gap-1">
                            {field.label}
                            {md?.required !== false && <span className="text-error">*</span>}
                            {md?.hint_ar && lang === "ar" && <span className="text-xs text-text-secondary font-normal">({md.hint_ar})</span>}
                            {md?.hint_fr && lang === "fr" && <span className="text-xs text-text-secondary font-normal">({md.hint_fr})</span>}
                          </label>
                          <input
                            type={inputType}
                            value={fieldValues[field.name] || ""}
                            onChange={(e) => { setFieldValues((prev) => ({ ...prev, [field.name]: e.target.value })); setFieldErrors((prev) => { const n = { ...prev }; delete n[field.name]; return n; }); }}
                            onBlur={() => handleBlur(field)}
                            placeholder={field.placeholder}
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
                {currentStep > 0 && (
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
