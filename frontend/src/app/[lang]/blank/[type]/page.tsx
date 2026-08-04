"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTemplate, API_BASE } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Download, FileText, Loader2, X, Wand, ChevronLeft } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import DownloadAdPopup from "@/components/v2/DownloadAdPopup";

export default function V2BlankPage() {
  const params = useParams();
  const lang = (params.lang as string) || "fr";
  const type = params.type as string;
  const isRtl = lang === "ar";

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customizing, setCustomizing] = useState(false);
  const [customized, setCustomized] = useState(false);
  const [sections, setSections] = useState(null);
  const [waitingFormat, setWaitingFormat] = useState(null);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        if (!t) { setError("Template not found"); setLoading(false); return; }
        setTemplate(t); setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [type]);

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
    setCustomizing(true); setError(null);
    trackEvent("blank_customize", { slug: type, lang });
    try {
      const res = await fetch(`${API_BASE}/contracts/templates/${type}/customize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_slug: type, language: lang, user_fields: {}, extra_notes: customPrompt.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Customization failed");
      const data = await res.json();
      setSections(buildBlank({ sections: data.sections || [] }));
      setCustomized(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setCustomizing(false);
    }
  };

  const flatContract = () => ({
    id: template?.id || `${type}-v1`, slug: type,
    title_ar: template?.title_ar || "", title_fr: template?.title_fr || "",
    sections: displaySections,
  });

  const handleDownloadStart = (format) => {
    trackEvent("blank_download", { slug: type, lang, format });
    setWaitingFormat(format);
  };
  const handleDownloadAdComplete = () => {
    const format = waitingFormat;
    if (format) doDownload(format);
  };

  const doDownload = async (format) => {
    try {
      const endpoint = format === "docx" ? "generate/docx" : "generate/pdf";
      const res = await fetch(`${API_BASE}/contracts/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_slug: type, language: lang, contract_json: flatContract() }),
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
        <p className="text-text-secondary">{error || "Template not found"}</p>
        <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
          {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? template.title_ar : template.title_fr;
  const homeLink = `/${lang}`;
  const detailLink = `/${lang}/contracts/${type}`;
  const generateLink = `/${lang}/generate/${type}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border-slate px-4 md:px-8 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href={homeLink} className="text-lg font-bold text-primary tracking-tight">Contraty</Link>
          <span className="w-px h-4 bg-border-slate" />
          <Link href={detailLink} className="text-sm text-text-secondary truncate max-w-[200px] hover:text-primary transition-colors">{title}</Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <FileText size={12} className="text-primary" />
            {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"}
          </span>
          <Link href={homeLink} className="flex items-center gap-1 text-error hover:text-error/80 transition-colors">
            <X size={14} />
            {lang === "ar" ? "إغلاق" : "Quitter"}
          </Link>
        </div>
      </div>

      {waitingFormat && (
        <DownloadAdPopup lang={lang} onComplete={handleDownloadAdComplete} onClose={() => setWaitingFormat(null)} />
      )}

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-8 md:py-10">
        <Link href={detailLink} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4 transition-colors">
          {isRtl ? <ArrowRight size={14} /> : <ChevronLeft size={14} />}
          {lang === "ar" ? "تفاصيل العقد" : "Détails du contrat"}
        </Link>

        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"}: {title}
        </h1>
        <p className="text-sm text-text-secondary mt-1 mb-8">
          {lang === "ar" ? "قم بتحميل النموذج واملأه يدوياً، أو استخدم الذكاء الاصطناعي لتخصيصه" : "Téléchargez le modèle et remplissez-le manuellement, ou utilisez l'IA pour le personnaliser"}
        </p>

        {/* AI Customization */}
        {!customized && (
          <div className="bg-primary-fixed/20 rounded-2xl p-5 md:p-6 mb-6">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
              <Wand size={15} />
              {lang === "ar" ? "تخصيص النموذج عبر الذكاء الاصطناعي" : "Personnaliser avec l'IA"}
            </h3>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              {lang === "ar"
                ? "صف التعديلات التي تريدها على النموذج (مرة واحدة فقط). مثال: أضف شرط عدم المنافسة لمدة سنتين."
                : "Décrivez les modifications souhaitées (une seule fois). Ex: Ajoutez une clause de non-concurrence de 2 ans."}
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="input-field min-h-[80px] text-sm mb-3 rounded-xl resize-none"
              placeholder={lang === "ar"
                ? "مثال: أضف شرطاً يمنع المستأجر من تغيير النشاط التجاري دون موافقة المالك..."
                : "Ex: Ajoutez une clause interdisant au locataire de changer l'activité commerciale sans accord du propriétaire..."}
            />
            <button
              onClick={handleCustomize}
              disabled={!customPrompt.trim() || customizing}
              className="flex items-center gap-2 bg-cat-family text-white font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 text-sm"
            >
              {customizing && <Loader2 size={14} className="animate-spin" />}
              {customizing
                ? (lang === "ar" ? "جاري التعديل..." : "Modification en cours...")
                : (lang === "ar" ? "تطبيق التعديلات" : "Appliquer les modifications")}
            </button>
          </div>
        )}

        {customized && (
          <div className="bg-success-light border border-success-green/20 rounded-2xl px-5 py-3 text-sm text-success-green mb-6 flex items-center gap-2">
            <Download size={14} />
            {lang === "ar" ? "تم تعديل النموذج حسب طلبك." : "Modèle modifié selon votre demande."}
          </div>
        )}

        {/* Contract preview */}
        <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm p-6 md:p-8 max-h-[500px] overflow-y-auto space-y-4 mb-6">
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
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
          <button onClick={() => handleDownloadStart("pdf")} className="flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 text-base">
            <Download size={18} />
            PDF
          </button>
          <button onClick={() => handleDownloadStart("docx")} className="flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-4 rounded-2xl hover:bg-primary-fixed transition-colors text-base">
            <FileText size={18} />
            Word
          </button>
        </div>

        {error && <p className="text-sm text-error mt-4">{error}</p>}

        <div className="mt-6 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40">
          <p className="text-xs text-text-secondary leading-relaxed">
            {lang === "ar"
              ? "هذا النموذج فارغ ومخصص للتعبئة اليدوية. لإنشاء عقد مملوء تلقائياً، استخدم المعالج."
              : "Ce modèle est vierge et destiné au remplissage manuel. Pour générer un contrat automatiquement, utilisez l'assistant."}
          </p>
          <Link href={generateLink} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2 font-medium">
            {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            {lang === "ar" ? "استخدم المعالج التلقائي" : "Utiliser l'assistant automatique"}
          </Link>
        </div>
      </div>
    </div>
  );
}
