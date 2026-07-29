"use client";

import { useEffect, useState } from "react";
import Ad from "@/components/ads/Ad";

interface Props {
  lang: string;
  isReady: boolean;
  onComplete: () => void;
}

const MIN_AD_SECONDS = 5;

export default function LoadingWithAd({ lang, isReady, onComplete }: Props) {
  const [adCountdown, setAdCountdown] = useState(MIN_AD_SECONDS);

  useEffect(() => {
    if (!isReady) return;
    if (adCountdown <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isReady, adCountdown, onComplete]);

  const msg = lang === "ar"
    ? { generating: "جاري إنشاء العقد...", wait: "يرجى الانتظار", ready: "اكتمل إنشاء العقد", soon: "سيظهر العقد خلال لحظات" }
    : { generating: "Génération du contrat...", wait: "Veuillez patienter", ready: "Contrat généré", soon: "Votre contrat s'affiche dans quelques instants" };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {isReady ? msg.ready : msg.generating}
        </h2>
        <p className="text-text-secondary mb-6">
          {isReady ? msg.soon : msg.wait}
        </p>
        {isReady ? (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <span className="text-3xl font-bold text-primary">{adCountdown}</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="w-full max-w-md">
        <Ad size="rectangle" className="mx-auto" />
      </div>
    </div>
  );
}
