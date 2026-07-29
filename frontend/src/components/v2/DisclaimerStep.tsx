"use client";

import { ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  lang: string;
  disclaimerAccepted: boolean;
  templateDisclaimer?: string;
  error?: string | null;
  onAccept: (accepted: boolean) => void;
  onNext: () => void;
}

const TEXT: Record<string, { title: string; p1: string; p2: string; checkbox: string; cta: string }> = {
  ar: {
    title: "إخلاء مسؤولية قانونية",
    p1: "النماذج المقدمة على منصة كونتراتي هي نماذج إرشادية لم يراجعها محامٍ. لا تشكل استشارة قانونية ولا تغني عن مراجعة مختص.",
    p2: "تقع مسؤولية التحقق من ملاءمة العقد لحالتك الخاصة عليك وحدك. يُنصح بشدة بمراجعة العقد من قبل محامٍ قبل استخدامه.",
    checkbox: "أقر بأنني فهمت هذا الإخلاء وأتحمل كامل المسؤولية عن استخدام العقد المُنشأ.",
    cta: "متابعة",
  },
  fr: {
    title: "Avertissement légal",
    p1: "Les modèles fournis sur la plateforme Contraty sont des modèles indicatifs qui n'ont pas été révisés par un avocat. Ils ne constituent pas un conseil juridique et ne remplacent pas la consultation d'un professionnel du droit.",
    p2: "Il est de votre seule responsabilité de vérifier l'adéquation du contrat à votre situation particulière. Il est fortement recommandé de faire relire le contrat par un avocat avant utilisation.",
    checkbox: "Je reconnais avoir pris connaissance de cet avertissement et assume l'entière responsabilité de l'utilisation du contrat généré.",
    cta: "Continuer",
  },
};

export default function DisclaimerStep({ lang, disclaimerAccepted, templateDisclaimer, error, onAccept, onNext }: Props) {
  const t = TEXT[lang] || TEXT.fr;
  const isRtl = lang === "ar";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-primary-fixed/30 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-error" />
          </div>
          <h2 className="text-xl font-bold text-on-surface pt-1">{t.title}</h2>
        </div>
        <div className="text-sm text-on-surface-variant leading-relaxed space-y-3 ps-0">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          {templateDisclaimer && (
            <p className="text-xs opacity-75 border-t border-outline-variant/40 pt-3">{templateDisclaimer}</p>
          )}
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer p-4 bg-surface rounded-2xl border border-outline-variant/40 mb-6">
        <input
          type="checkbox"
          checked={disclaimerAccepted}
          onChange={(e) => onAccept(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-border-slate text-primary focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-sm text-on-surface leading-relaxed">{t.checkbox}</span>
      </label>

      {error && <p className="text-sm text-error mb-4">{error}</p>}

      <button
        onClick={onNext}
        disabled={!disclaimerAccepted}
        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-4 rounded-2xl hover:bg-surface-tint transition-colors shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none text-base"
      >
        {t.cta}
        {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
      </button>
    </div>
  );
}
