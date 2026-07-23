"use client";

import { AlertCircle, CheckCircle2, Download, FileText, Loader2 } from "lucide-react";
import type { GenerateResponse, ContractWarning } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  lang: string;
  type: string;
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
  lang,
  type,
  title,
  generated,
  appliedSuggestions,
  generating,
  onApplySuggestion,
  onEditField,
  onSaveInline,
  onSetApplied,
  onRegenerate,
  onDownload,
  onBack,
  editingField,
  inlineValue,
  setInlineValue,
  setEditingField,
}: Props) {
  const isRtl = lang === "ar";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-success-light border border-success-green/20 rounded-lg px-4 py-3">
        <CheckCircle2 size={20} className="text-success-green" />
        <div>
          <p className="text-sm font-semibold text-success-green">
            {lang === "ar" ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès!"}
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

      {generated.warnings?.length > 0 && (
        <div className="border border-cat-family/40 rounded-lg bg-cat-family/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-cat-family" />
            <span className="text-sm font-semibold text-on-surface">
              {lang === "ar" ? "مراجعة" : "Révision"} ({generated.warnings.length})
            </span>
          </div>
          {generated.warnings.map((w, i) => {
            const ctype = w.correction_type || "auto";
            const applied = appliedSuggestions.has(`${w.field}:${w.suggested_value}`);
            const dismissed = appliedSuggestions.has(`dismiss:${w.field}:${w.message_fr}`);
            if (dismissed && ctype === "info") return null;
            return (
              <div
                key={i}
                className={`text-sm p-3 rounded-lg ${
                  w.severity === "error"
                    ? "bg-error/10 border border-error/20"
                    : "bg-cat-family/10 border border-cat-family/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={14}
                    className={
                      w.severity === "error"
                        ? "text-error shrink-0 mt-0.5"
                        : "text-cat-family shrink-0 mt-0.5"
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface">
                      {lang === "ar" ? w.message_ar : w.message_fr}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {lang === "ar" ? w.suggestion_ar : w.suggestion_fr}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {applied ? (
                        <span className="text-xs text-success-green font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {lang === "ar"
                            ? ctype === "manual"
                              ? "تم القبول"
                              : w.suggested_value
                                ? `تم التطبيق: ${w.suggested_value}`
                                : "تم القبول"
                            : ctype === "manual"
                              ? "Accepté"
                              : w.suggested_value
                                ? `Appliqué : ${w.suggested_value}`
                                : "Accepté"}
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
                                  className="input-field text-xs py-1 px-2 min-w-[180px]"
                                  autoFocus
                                />
                                <button
                                  onClick={() => onSaveInline(w.field)}
                                  className="text-xs bg-success-green/20 text-success-green font-medium px-2 py-1 rounded hover:bg-success-green/30 transition-colors"
                                >
                                  {lang === "ar" ? "حفظ" : "OK"}
                                </button>
                                <button
                                  onClick={() => setEditingField(null)}
                                  className="text-xs text-text-secondary font-medium px-2 py-1 rounded hover:bg-surface-container transition-colors"
                                >
                                  {lang === "ar" ? "إلغاء" : "Annuler"}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => onEditField(w.field)}
                                  className="text-xs bg-cat-family/20 text-cat-family font-medium px-2 py-1 rounded hover:bg-cat-family/30 transition-colors"
                                >
                                  {lang === "ar" ? "تعديل" : "Corriger"}
                                </button>
                                <button
                                  onClick={() => {
                                    onSetApplied((prev) => new Set([...prev, `accept:${w.field}:manual`]));
                                  }}
                                  className="text-xs bg-success-green/10 text-success-green font-medium px-2 py-1 rounded hover:bg-success-green/20 transition-colors"
                                >
                                  {lang === "ar" ? "قبول كما هو" : "Accepter tel quel"}
                                </button>
                              </>
                            )
                          ) : w.suggested_value ? (
                            <button
                              onClick={() => onApplySuggestion(w)}
                              className="text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                            >
                              {lang === "ar"
                                ? `تطبيق: ${w.suggested_value}`
                                : `Appliquer: ${w.suggested_value}`}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onSetApplied(
                                  (prev) => new Set([...prev, `dismiss:${w.field}:${w.message_fr}`]),
                                );
                              }}
                              className="text-xs text-text-secondary font-medium px-2 py-1 rounded hover:bg-surface-container transition-colors"
                            >
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
            <div className="flex gap-3 pt-2">
              <button
                onClick={onRegenerate}
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
                <p
                  key={article.id}
                  className="text-sm text-on-surface leading-relaxed mb-2 whitespace-pre-wrap"
                >
                  {displayText}
                </p>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onDownload("pdf")}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-4 rounded-lg hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Download size={16} />
          PDF
        </button>
        <button
          onClick={() => onDownload("docx")}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-3 px-4 rounded-lg hover:bg-primary-fixed transition-colors"
        >
          <FileText size={16} />
          Word
        </button>
      </div>

      <button onClick={onBack} className="text-sm text-text-secondary hover:text-primary transition-colors">
        {isRtl ? "→" : "←"} {lang === "ar" ? "العودة للنموذج" : "Retour au formulaire"}
      </button>
    </div>
  );
}
