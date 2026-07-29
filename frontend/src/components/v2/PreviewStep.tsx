"use client";

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Loader2, RefreshCw } from "lucide-react";
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
        <div className="border border-cat-family/30 rounded-2xl bg-cat-family/5 p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-cat-family" />
            <span className="text-sm font-semibold text-on-surface">
              {lang === "ar" ? "مراجعة" : "Révision"} ({generated.warnings.length})
            </span>
          </div>
          {generated.warnings.map((w, i) => {
            const ctype = w.correction_type || "auto";
            const applied = appliedSuggestions.has(`${w.field}:${w.suggested_value}`);
            const corrected = appliedSuggestions.has(`corrected:${w.field}`);
            const accepted = appliedSuggestions.has(`accepted:${w.field}`);
            const dismissed = appliedSuggestions.has(`dismiss:${w.field}:${w.message_fr}`);
            const resolved = applied || corrected || accepted;
            if (dismissed && ctype === "info") return null;
            return (
              <div
                key={i}
                className={`text-sm p-4 rounded-xl ${
                  w.severity === "error"
                    ? "bg-error/8 border border-error/20"
                    : "bg-cat-family/8 border border-cat-family/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={14}
                    className={w.severity === "error" ? "text-error shrink-0 mt-0.5" : "text-cat-family shrink-0 mt-0.5"}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface">{lang === "ar" ? w.message_ar : w.message_fr}</p>
                    <p className="text-xs text-text-secondary mt-1">{lang === "ar" ? w.suggestion_ar : w.suggestion_fr}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {resolved ? (
                        <span className="text-xs text-success-green font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {applied
                            ? (lang === "ar" ? "تم التطبيق" : "Appliqué")
                            : corrected
                              ? (lang === "ar" ? "تم التصحيح" : "Corrigé")
                              : (lang === "ar" ? "تم القبول" : "Accepté")}
                        </span>
                      ) : dismissed ? (
                        <span className="text-xs text-text-secondary font-medium">
                          {lang === "ar" ? "تم التجاهل" : "Ignoré"}
                        </span>
                      ) : (
                        <>
                          {ctype === "manual" ? (
                            editingField === w.field ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={inlineValue}
                                  onChange={(e) => setInlineValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") onSaveInline(w.field);
                                    if (e.key === "Escape") setEditingField(null);
                                  }}
                                  className="input-field text-xs py-1.5 px-3 min-w-[180px] rounded-lg"
                                  autoFocus
                                />
                                <button onClick={() => onSaveInline(w.field)} className="text-xs bg-success-green/20 text-success-green font-medium px-3 py-1.5 rounded-lg hover:bg-success-green/30 transition-colors">
                                  {lang === "ar" ? "حفظ" : "OK"}
                                </button>
                                <button onClick={() => setEditingField(null)} className="text-xs text-text-secondary font-medium px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                                  {lang === "ar" ? "إلغاء" : "Annuler"}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button onClick={() => onEditField(w.field)} className="text-xs bg-cat-family/15 text-cat-family font-medium px-3 py-1.5 rounded-lg hover:bg-cat-family/25 transition-colors">
                                  {lang === "ar" ? "تعديل" : "Corriger"}
                                </button>
                                <button onClick={() => onSetApplied((prev) => new Set([...prev, `accepted:${w.field}`]))} className="text-xs bg-success-green/10 text-success-green font-medium px-3 py-1.5 rounded-lg hover:bg-success-green/20 transition-colors">
                                  {lang === "ar" ? "قبول كما هو" : "Accepter tel quel"}
                                </button>
                              </>
                            )
                          ) : w.suggested_value ? (
                            <button onClick={() => onApplySuggestion(w)} className="text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                              {lang === "ar" ? `تطبيق: ${w.suggested_value}` : `Appliquer: ${w.suggested_value}`}
                            </button>
                          ) : (
                            <button onClick={() => onSetApplied((prev) => new Set([...prev, `dismiss:${w.field}:${w.message_fr}`]))} className="text-xs text-text-secondary font-medium px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
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
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold py-2.5 px-4 rounded-xl hover:bg-surface-tint transition-colors disabled:opacity-50 text-sm"
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {lang === "ar" ? "إعادة الإنشاء بالتعديلات" : "Régénérer avec les corrections"}
            </button>
          )}
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
