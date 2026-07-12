"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, API_BASE } from "@/lib/constants";
import { ArrowLeft, Download, FileText, Loader2, X, Lock, Wand } from "lucide-react";

export default function BlankPreviewPage() {
  const params = useParams();
  const { lang, type } = params;
  const isRtl = lang === "ar";

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customizing, setCustomizing] = useState(false);
  const [customized, setCustomized] = useState(false);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) { setError("Template not found"); setLoading(false); return; }
        setTemplate(t);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [type]);

  // Build blank sections with dots on their own line
  const buildBlank = (tmpl) => {
    if (!tmpl) return [];
    return (tmpl.sections || []).map((section) => ({
      ...section,
      articles: (section.articles || []).map((article) => {
        const rawText = lang === "ar" ? article.text_ar : article.text_fr;
        const filledText = rawText.replace(/\[([A-Z_]+)\]/g, "................................");
        return { ...article, [lang === "ar" ? "text_ar" : "text_fr"]: filledText };
      }),
    }));
  };

  const displaySections = sections || (template ? buildBlank(template) : []);

  const handleCustomize = async () => {
    if (!customPrompt.trim() || customized) return;
    setCustomizing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contracts/templates/${type}/customize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          user_fields: {},
          extra_notes: customPrompt.trim(),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Customization failed");
      const data = await res.json();
      // Rebuild sections with dots from the AI-modified template
      const newSections = buildBlank({ sections: data.sections || [] });
      setSections(newSections);
      setCustomized(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setCustomizing(false);
    }
  };

  const flatContract = () => ({
    id: template?.id || `${type}-v1`,
    slug: type,
    title_ar: template?.title_ar || "",
    title_fr: template?.title_fr || "",
    sections: displaySections,
  });

  const handleDownload = async (format) => {
    try {
      const endpoint = format === "docx" ? "generate/docx" : "generate/pdf";
      const res = await fetch(`${API_BASE}/contracts/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          contract_json: flatContract(),
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
        <p className="text-sm text-text-secondary mb-6">
          {lang === "ar"
            ? "قم بتحميل النموذج واملأه يدوياً"
            : "Téléchargez le modèle et remplissez-le manuellement"}
        </p>

        {/* AI Customization */}
        {!customized && (
          <div className="bg-surface-container-lowest rounded-lg border border-cat-family/30 p-4 mb-6">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
              <Wand size={14} />
              {lang === "ar" ? "تخصيص النموذج عبر الذكاء الاصطناعي" : "Personnaliser avec l'IA"}
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              {lang === "ar"
                ? "صف التعديلات التي تريدها على النموذج (مرة واحدة فقط). مثال: أضف شرط عدم المنافسة لمدة سنتين."
                : "Décrivez les modifications souhaitées (une seule fois). Ex: Ajoutez une clause de non-concurrence de 2 ans."}
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="input-field min-h-[80px] text-sm mb-3"
              placeholder={lang === "ar"
                ? "مثال: أضف شرطاً يمنع المستأجر من تغيير النشاط التجاري دون موافقة المالك..."
                : "Ex: Ajoutez une clause interdisant au locataire de changer l'activité commerciale sans accord du propriétaire..."}
            />
            <button
              onClick={handleCustomize}
              disabled={!customPrompt.trim() || customizing}
              className="flex items-center gap-2 bg-cat-family text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 text-sm"
            >
              {customizing && <Loader2 size={14} className="animate-spin" />}
              {customizing
                ? (lang === "ar" ? "جاري التعديل..." : "Modification en cours...")
                : (lang === "ar" ? "تطبيق التعديلات" : "Appliquer les modifications")}
            </button>
          </div>
        )}

        {customized && (
          <div className="bg-success-light border border-success-green/20 rounded-lg px-4 py-2 text-sm text-success-green mb-6">
            {lang === "ar" ? "✓ تم تعديل النموذج حسب طلبك." : "✓ Modèle modifié selon votre demande."}
          </div>
        )}

        {/* Contract preview */}
        <div className="bg-surface border border-border-slate rounded-lg p-6 max-h-[500px] overflow-y-auto space-y-4 mb-6">
          <h2 className="text-lg font-bold text-primary text-center mb-4">{title}</h2>
          {displaySections.map((section) => (
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
