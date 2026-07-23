"use client";

import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";

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
  lang,
  type,
  extraNotes,
  generating,
  error,
  loadingMsg,
  onNotesChange,
  onGenerate,
  onPrevious,
}: Props) {
  const placeholder =
    NOTES_PLACEHOLDER[type]?.[lang] ||
    (lang === "ar"
      ? "مثال: أريد إضافة بند خاص يوضح تفاصيل إضافية للعقد."
      : "Ex: Je souhaite ajouter une clause particulière précisant des détails supplémentaires au contrat.");

  return (
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
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          className="input-field min-h-[100px]"
          placeholder={placeholder}
        />
      </div>
      {generating && (
        <div className="flex flex-col items-center gap-2 py-4 animate-pulse">
          <Loader2 size={24} className="animate-spin text-primary" />
          <p className="text-sm text-text-secondary">{loadingMsg}</p>
        </div>
      )}
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-4 border-t border-border-slate">
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-fixed transition-colors"
        >
          <ArrowLeft size={16} />
          {lang === "ar" ? "السابق" : "Retour"}
        </button>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 ms-auto"
        >
          {generating && <Loader2 size={16} className="animate-spin" />}
          {generating ? loadingMsg : lang === "ar" ? "إنشاء العقد" : "Générer le contrat"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
