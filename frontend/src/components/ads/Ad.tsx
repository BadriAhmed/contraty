"use client";

import { useEffect } from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

const SLOTS: Record<string, string> = {
  banner: process.env.NEXT_PUBLIC_AD_SLOT_BANNER || "",
  rectangle: process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE || "",
  mobile: process.env.NEXT_PUBLIC_AD_SLOT_MOBILE || "",
};

interface Props {
  size?: "banner" | "rectangle" | "mobile";
  className?: string;
}

export default function Ad({ size = "banner", className = "" }: Props) {
  const slot = SLOTS[size] || SLOTS.banner;

  return (
    <div className={className}>
      {AD_CLIENT && slot ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <MockAdPlaceholder size={size} />
      )}
    </div>
  );
}

function MockAdPlaceholder({ size }: { size: string }) {
  const configs: Record<string, { width: string; height: string; label: string }> = {
    banner: { width: "728px", height: "90px", label: "728x90" },
    rectangle: { width: "300px", height: "250px", label: "300x250" },
    mobile: { width: "320px", height: "50px", label: "320x50" },
  };
  const { width, height, label } = configs[size] || configs.banner;

  return (
    <div
      className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center mx-auto"
      style={{ width, maxWidth: "100%", height, minHeight: height }}
    >
      <div className="text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">إعلان · PUBLICITÉ</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Google AdSense</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      </div>
    </div>
  );
}
