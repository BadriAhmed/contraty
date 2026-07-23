"use client";

import { ArrowRight } from "lucide-react";
import { ShieldAlert } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <ShieldAlert size={24} className="text-error shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-2">{t.title}</h3>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            {templateDisclaimer && <p className="text-xs opacity-75 border-t border-border-slate pt-3">{templateDisclaimer}</p>}
          </div>
        </div>
      </div>
      <label className="flex items-start gap-3 cursor-pointer p-3 bg-surface rounded-lg border border-outline-variant/50">
        <input
          type="checkbox"
          checked={disclaimerAccepted}
          onChange={(e) => onAccept(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border-slate text-primary focus:ring-primary"
        />
        <span className="text-sm text-on-surface">{t.checkbox}</span>
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-3 pt-4 border-t border-border-slate">
        <button
          onClick={onNext}
          disabled={!disclaimerAccepted}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 ms-auto"
        >
          {t.cta}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
