"use client";

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Languages, Loader2, RefreshCw } from "lucide-react";
import type { GenerateResponse, ContractWarning } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  lang: string;
  title: string;
  generated: GenerateResponse;
  appliedSuggestions: Set<string>;
  generating: boolean;
  onApplySuggestion: (warning: ContractWarning) => void;
  onEditField: (fieldName: string) => void;
  onSaveInline: (fieldName: string) => void;
  onSetApplied: (update: (prev: Set<string>) => Set<string>) => void;
  onRegenerate: () => void;
  onDownload: (format: "pdf" | "docx") => void;
  onBack: () => void;
  editingField: string | null;
  inlineValue: string;
  setInlineValue: (v: string) => void;
  setEditingField: (v: string | null) => void;
}

export default function PreviewStep({
  lang, title, generated, appliedSuggestions, generating,
  onApplySuggestion, onEditField, onSaveInline, onSetApplied, onRegenerate, onDownload, onBack,
  editingField, inlineValue, setInlineValue, setEditingField,
}: Props) {
  const isRtl = lang === "ar";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success banner */}
      <div className="flex items-center gap-3 bg-success-light border border-success-green/20 rounded-2xl px-5 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-success-green/15 flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} className="text-success-green" />
        </div>
        <div>
          <p className="text-sm font-semibold text-success-green">
            {lang === "ar" ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès !"}
          </p>
          {generated.review_time_ms > 0 && (
            <p className="text-xs text-text-secondary">
              {lang === "ar"
                ? `تمت المراجعة في ${(generated.review_time_ms / 1000).toFixed(1)}s`
                : `Révisé en ${(generated.review_time_ms / 1000).toFixed(1)}s`}
            </p>
          )}
        </div>
      </div>

      {/* Warnings / Review */}
      {generated.warnings?.length > 0 && (
        <div className="border border-cat-family/40 rounded-2xl bg-surface overflow-hidden mb-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 px-5 py-3.5 bg-cat-family/10 border-b border-cat-family/30">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-cat-family" />
              <span className="text-sm font-bold text-on-surface">
                {lang === "ar" ? "مراجعة" : "Révision"}
              </span>
            </div>
            <span className="text-xs font-bold text-cat-family bg-cat-family/15 px-2.5 py-1 rounded-full">
              {generated.warnings.length}
            </span>
          </div>
          <div className="p-4 md:p-5 space-y-3">
          {generated.warnings.map((w, i) => {
            const ctype = w.correction_type || "auto";
            const applied = appliedSuggestions.has(`${w.field}:${w.suggested_value}`);
            const corrected = appliedSuggestions.has(`corrected:${w.field}`);
            const accepted = appliedSuggestions.has(`accepted:${w.field}`);
            const dismissed = appliedSuggestions.has(`dismiss:${w.field}:${w.message_fr}`);
            const resolved = applied || corrected || accepted;
            const isError = w.severity === "error";
            const isTranslation = w.severity === "info" && !!w.suggested_value;
            if (dismissed && ctype === "info") return null;
            return (
              <div
                key={i}
                className={`text-sm rounded-xl border overflow-hidden ${
                  isError
                    ? "border-error/30 bg-error/5"
                    : isTranslation
                      ? "border-primary/25 bg-primary/5"
                      : "border-cat-family/25 bg-cat-family/5"
                }`}
              >
                <div className="flex items-start gap-2.5 p-4">
                  {isTranslation ? (
                    <Languages
                      size={16}
                      className="text-primary shrink-0 mt-0.5"
                    />
                  ) : (
                    <AlertCircle
                      size={16}
                      className={isError ? "text-error shrink-0 mt-0.5" : "text-cat-family shrink-0 mt-0.5"}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-on-surface">{lang === "ar" ? w.message_ar : w.message_fr}</p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                          isError
                            ? "bg-error/10 text-error"
                            : isTranslation
                              ? "bg-primary/10 text-primary"
                              : "bg-cat-family/15 text-cat-family"
                        }`}
                      >
                        {isError
                          ? (lang === "ar" ? "خطأ" : "Erreur")
                          : isTranslation
                            ? (lang === "ar" ? "تحويل" : "Conversion")
                            : (lang === "ar" ? "تنبيه" : "Avertissement")}
                      </span>
                    </div>
                    {w.suggestion_ar || w.suggestion_fr ? (
                      <p className="text-xs text-text-secondary mt-1">
                        {isTranslation
                          ? (lang === "ar" ? `سيُكتب: ${w.suggestion_ar}` : `Écrit en arabe : ${w.suggestion_fr}`)
                          : (lang === "ar" ? w.suggestion_ar : w.suggestion_fr)}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {resolved ? (
                        <span className="text-sm text-success-green font-semibold flex items-center gap-1.5 bg-success-green/10 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={15} />
                          {applied
                            ? (lang === "ar" ? "تم التطبيق" : "Appliqué")
                            : corrected
                              ? (lang === "ar" ? "تم التصحيح" : "Corrigé")
                              : (lang === "ar" ? "تم القبول" : "Accepté")}
                        </span>
                      ) : dismissed ? (
                        <span className="text-sm text-text-secondary font-semibold flex items-center gap-1.5 border border-outline-variant/60 px-3 py-1.5 rounded-lg">
                          {lang === "ar" ? "تم التجاهل" : "Ignoré"}
                        </span>
                      ) : (
                        <>
                          {ctype === "manual" ? (
                            editingField === w.field ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="text"
                                  value={inlineValue}
                                  onChange={(e) => setInlineValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") onSaveInline(w.field);
                                    if (e.key === "Escape") setEditingField(null);
                                  }}
                                  className="input-field text-sm py-2 px-3 min-w-[180px] rounded-lg"
                                  autoFocus
                                />
                                <button onClick={() => onSaveInline(w.field)} className="text-sm bg-success-green text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-colors">
                                  {lang === "ar" ? "حفظ" : "OK"}
                                </button>
                                <button onClick={() => setEditingField(null)} className="text-sm text-text-secondary font-medium px-4 py-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container transition-colors">
                                  {lang === "ar" ? "إلغاء" : "Annuler"}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button onClick={() => onEditField(w.field)} className="text-sm bg-cat-family text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm">
                                  {lang === "ar" ? "تعديل" : "Corriger"}
                                </button>
                                <button onClick={() => onSetApplied((prev) => new Set([...prev, `accepted:${w.field}`]))} className="text-sm bg-success-green text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm">
                                  {lang === "ar" ? "قبول كما هو" : "Accepter tel quel"}
                                </button>
                              </>
                            )
                          ) : w.suggested_value ? (
                            <button onClick={() => onApplySuggestion(w)} className="text-sm bg-primary text-on-primary font-semibold px-4 py-2 rounded-lg hover:bg-surface-tint transition-colors shadow-sm">
                              {lang === "ar" ? `تطبيق: ${w.suggested_value}` : `Appliquer: ${w.suggested_value}`}
                            </button>
                          ) : (
                            <button onClick={() => onSetApplied((prev) => new Set([...prev, `dismiss:${w.field}:${w.message_fr}`]))} className="text-sm text-text-secondary font-medium px-4 py-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container transition-colors">
                              {lang === "ar" ? "تجاهل" : "Ignorer"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {appliedSuggestions.size > 0 && (
            <button
              onClick={onRegenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3.5 px-5 rounded-xl hover:bg-surface-tint transition-colors disabled:opacity-50 text-sm md:text-base shadow-lg shadow-primary/20"
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {lang === "ar" ? "إعادة الإنشاء بالتعديلات" : "Régénérer avec les corrections"}
            </button>
          )}
          </div>
        </div>
      )}

      {/* Contract preview */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm p-6 md:p-8 max-h-[500px] overflow-y-auto space-y-4 mb-6">
        <h2 className="text-lg font-bold text-primary text-center mb-4">{title}</h2>
        {(generated.contract?.sections || []).map((section) => (
          <div key={section.id}>
            <h3 className="text-sm font-semibold text-primary border-b border-border-slate pb-1 mb-2">
              {lang === "ar" ? section.title_ar : section.title_fr}
            </h3>
            {(section.articles || []).map((article) => {
              const rawText = lang === "ar" ? article.text_ar : article.text_fr;
              if (!rawText || !rawText.trim()) return null;
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

      {/* Download buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => onDownload("pdf")} className="flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 text-base">
          <Download size={18} />
          PDF
        </button>
        <button onClick={() => onDownload("docx")} className="flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-4 rounded-2xl hover:bg-primary-fixed transition-colors text-base">
          <FileText size={18} />
          Word
        </button>
      </div>

      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors py-2">
        {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
        {lang === "ar" ? "العودة إلى النموذج" : "Retour au formulaire"}
      </button>
    </div>
  );
}
