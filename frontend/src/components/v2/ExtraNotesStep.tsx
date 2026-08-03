"use client";

import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";

const NOTES_PLACEHOLDER: Record<string, { fr: string; ar: string }> = {
  "lettre-demission": { fr: "Ex: Je souhaite ajouter une clause de télétravail durant la période de préavis.", ar: "مثال: أرغب في إضافة شرط ينص على مواصلة العمل عن بعد خلال فترة الإعلام المسبق." },
  "contrat-cdi": { fr: "Ex: Je stipule une période d'essai de 6 mois conformément à l'article 12 du Code du travail.", ar: "مثال: أشترط مدة تجربة 6 أشهر وفق الفصل 12 من مجلة الشغل." },
  "contrat-cdd": { fr: "Ex: Je souhaite ajouter une clause de priorité d'embauche en cas d'ouverture d'un poste permanent.", ar: "مثال: أرغب في إضافة بند يمنحني أسبقية التوظيف عند فتح منصب قار." },
  "bail-habitation": { fr: "Ex: Je souhaite ajouter une clause interdisant les animaux domestiques dans le logement.", ar: "مثال: أريد إضافة بند يمنع تربية الحيوانات الأليفة في المسكن." },
  "rupture-conventionnelle": { fr: "Ex: Une indemnité de départ de 5000 TND a été convenue.", ar: "مثال: تم الاتفاق على منحة مغادرة بقدر 5000 دينار." },
  "pret-particuliers": { fr: "Ex: Je veux définir un échéancier : 200 TND par mois à partir du 1er janvier 2027.", ar: "مثال: أريد تحديد جدول سداد: 200 دينار شهريًا بداية من 1 جانفي 2027." },
  "compromis-vente-immobilier": { fr: "Ex: Je stipule une clause de dédit permettant à l'acheteur de se rétracter sous 10 jours.", ar: "مثال: أشترط إدراج بند فسخي يسمح للمشتري بالرجوع خلال 10 أيام." },
};

interface Props {
  lang: string;
  type: string;
  extraNotes: string;
  generating: boolean;
  error: string | null;
  loadingMsg: string;
  onNotesChange: (value: string) => void;
  onGenerate: () => void;
  onPrevious: () => void;
}

export default function ExtraNotesStep({
  lang, type, extraNotes, generating, error, loadingMsg, onNotesChange, onGenerate, onPrevious,
}: Props) {
  const isRtl = lang === "ar";
  const placeholder =
    NOTES_PLACEHOLDER[type]?.[lang] ||
    (lang === "ar"
      ? "مثال: أريد إضافة بند خاص يوضح تفاصيل إضافية للعقد."
      : "Ex: Je souhaite ajouter une clause particulière précisant des détails supplémentaires au contrat.");

  return (
    <div className="w-full">
      <div className="bg-primary-fixed/20 rounded-2xl p-4 md:p-6 lg:p-8 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="md:size-[20px] text-primary" />
          </div>
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-on-surface">
            {lang === "ar" ? "ملاحظات إضافية" : "Remarques supplémentaires"}
          </h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {lang === "ar"
            ? "أي تفاصيل أخرى تود إضافتها إلى العقد؟ (اختياري)"
            : "Des détails supplémentaires à ajouter au contrat ? (optionnel)"}
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-4 md:p-5 lg:p-6 mb-4">
        <textarea
          value={extraNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          className="input-field min-h-[100px] md:min-h-[120px] text-base rounded-xl resize-none"
          placeholder={placeholder}
          disabled={generating}
        />
      </div>

      {generating && (
        <div className="flex flex-col items-center gap-3 py-6 bg-surface rounded-2xl border border-primary/20 mb-4">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm font-medium text-primary">{loadingMsg}</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-error mb-4 flex items-center gap-1.5">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onPrevious}
          disabled={generating}
          className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-on-surface transition-colors px-3 py-3 md:px-4 rounded-xl hover:bg-surface-container disabled:opacity-50 shrink-0"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span className="hidden sm:inline">{lang === "ar" ? "رجوع" : "Retour"}</span>
        </button>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3.5 md:py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 text-sm md:text-base"
        >
          {generating && <Loader2 size={18} className="animate-spin" />}
          {generating ? loadingMsg : (lang === "ar" ? "إنشاء العقد" : "Générer le contrat")}
          {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
