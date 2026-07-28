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

  const ar = {
    generating: "جاري إنشاء العقد...",
    wait: "يرجى الانتظار",
    ready: "اكتمل إنشاء العقد",
    downloadSoon: "سيظهر العقد خلال لحظات",
    adLabel: "مساحة إعلانية",
  };
  const fr = {
    generating: "Génération du contrat en cours...",
    wait: "Veuillez patienter",
    ready: "Contrat généré avec succès",
    downloadSoon: "Votre contrat s'affiche dans quelques instants",
    adLabel: "Espace publicitaire",
  };
  const msg = lang === "ar" ? ar : fr;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {isReady ? msg.ready : msg.generating}
        </h2>
        <p className="text-text-secondary mb-4">
          {isReady ? msg.downloadSoon : msg.wait}
        </p>
        {isReady ? (
          <div className="text-4xl font-bold text-primary">{adCountdown}</div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        <Ad size="rectangle" className="mx-auto" />
      </div>
    </div>
  );
}
