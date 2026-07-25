"use client";

import { useEffect, useState } from "react";
import Ad from "@/components/ads/Ad";

interface LoadingWithAdProps {
  lang: string;
  onComplete: () => void;
}

export default function LoadingWithAd({ lang, onComplete }: LoadingWithAdProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const messages = {
    ar: {
      title: "جاري إنشاء العقد...",
      subtitle: "يرجى الانتظار",
      adText: "مساحة إعلانية",
    },
    fr: {
      title: "Génération du contrat en cours...",
      subtitle: "Veuillez patienter",
      adText: "Espace publicitaire",
    },
  };

  const msg = messages[lang] || messages.fr;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-2">{msg.title}</h2>
        <p className="text-text-secondary mb-4">{msg.subtitle}</p>
        <div className="text-4xl font-bold text-primary">{countdown}</div>
      </div>

      <div className="w-full max-w-md">
        <Ad size="rectangle" className="mx-auto" />
      </div>
    </div>
  );
}
