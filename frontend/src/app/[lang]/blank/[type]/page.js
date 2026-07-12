"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, API_BASE } from "@/lib/constants";
import { ArrowLeft, Download, FileText, Loader2, X, Lock } from "lucide-react";

export default function BlankPreviewPage() {
  const params = useParams();
  const { lang, type } = params;
  const isRtl = lang === "ar";

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) { setError("Template not found"); setLoading(false); return; }
        setTemplate(t);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
        <p className="text-text-secondary">{error || "Template not found"}</p>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;

  // Client-side blank fill: replace [PLACEHOLDER] with dots
  const blankSections = (template.sections || []).map((section) => ({
    ...section,
    articles: (section.articles || []).map((article) => {
      const rawText = lang === "ar" ? article.text_ar : article.text_fr;
      const filledText = rawText.replace(/\[([A-Z_]+)\]/g, "................................");
      return { ...article, [lang === "ar" ? "text_ar" : "text_fr"]: filledText };
    }),
  }));

  const blankContract = {
    id: template.id || `${type}-v1`,
    slug: type,
    title_ar: template.title_ar,
    title_fr: template.title_fr,
    sections: blankSections,
  };

  const handleDownload = async (format) => {
    try {
      const endpoint = format === "docx" ? "generate/docx" : "generate/pdf";
      const res = await fetch(`${API_BASE}/contracts/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          contract_json: blankContract,
        }),
      });
      if (!res.ok) throw new Error(`${format} failed`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-vierge-${lang}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border-slate px-4 md:px-8 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}`} className="text-lg font-bold text-primary">Contraty</Link>
          <span className="w-px h-4 bg-border-slate" />
          <span className="text-sm text-text-secondary truncate max-w-[200px]">{title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Lock size={12} className="text-success-green" />
            {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"}
          </span>
          <Link href={`/${lang}`} className="flex items-center gap-1 text-error hover:text-error/80">
            <X size={14} />{lang === "ar" ? "خروج" : "Quitter"}
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
        <Link
          href={`/${lang}/contracts/${type}`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-6"
        >
          <ArrowLeft size={14} />
          {lang === "ar" ? "العودة" : "Retour"}
        </Link>

        <h1 className="text-xl font-bold text-on-surface mb-1">
          {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"} : {title}
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          {lang === "ar"
            ? "قم بتحميل النموذج واملأه يدوياً"
            : "Téléchargez le modèle et remplissez-le manuellement"}
        </p>

        {/* Contract preview */}
        <div className="bg-surface border border-border-slate rounded-lg p-6 max-h-[500px] overflow-y-auto space-y-4 mb-6">
          <h2 className="text-lg font-bold text-primary text-center mb-4">{title}</h2>
          {blankSections.map((section) => (
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

        {/* Download buttons */}
        <div className="flex gap-3">
          <button onClick={() => handleDownload("pdf")} className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-4 rounded-lg hover:bg-surface-tint transition-colors shadow-sm">
            <Download size={16} />
            PDF
          </button>
          <button onClick={() => handleDownload("docx")} className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-3 px-4 rounded-lg hover:bg-primary-fixed transition-colors">
            <FileText size={16} />
            Word
          </button>
        </div>

        {error && (
          <p className="text-sm text-error mt-4">{error}</p>
        )}

        <div className="mt-6 p-3 bg-surface-container rounded-lg border border-outline-variant/50">
          <p className="text-xs text-text-secondary leading-relaxed">
            {lang === "ar"
              ? "هذا النموذج فارغ ومخصص للتعبئة اليدوية. لإنشاء عقد مملوء تلقائياً، استخدم المعالج."
              : "Ce modèle est vierge et destiné au remplissage manuel. Pour générer un contrat automatiquement, utilisez l'assistant."}
          </p>
        </div>
      </div>
    </div>
  );
}
