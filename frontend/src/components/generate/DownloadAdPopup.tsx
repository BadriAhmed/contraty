"use client";

import { useEffect, useState } from "react";
import Ad from "@/components/ads/Ad";

interface Props {
  lang: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function DownloadAdPopup({ lang, onComplete, onClose }: Props) {
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
      setDownloadStarted(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-on-surface mb-2 text-center">
            {downloadStarted
              ? (lang === "ar" ? "تم التحميل" : "Téléchargement démarré")
              : (lang === "ar" ? "جاري تجهيز التحميل..." : "Préparation du téléchargement...")}
          </h2>
          <p className="text-sm text-text-secondary mb-5 text-center">
            {downloadStarted
              ? (lang === "ar" ? "الملف قيد التحميل" : "Votre fichier est en cours de téléchargement")
              : (lang === "ar"
                ? "سيبدأ التحميل تلقائيًا خلال لحظات"
                : "Votre téléchargement va démarrer automatiquement")}
          </p>

          <Ad size="rectangle" className="mx-auto" />

          <div className="mt-5 text-center">
            {downloadStarted ? (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm text-sm"
              >
                {lang === "ar" ? "إغلاق" : "Fermer"}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {lang === "ar" ? "يرجى الانتظار..." : "Veuillez patienter..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
