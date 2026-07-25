"use client";

import Ad from "@/components/ads/Ad";

export default function AdBanner({ size = "banner" }: { size?: "banner" | "rectangle" | "mobile" }) {
  return (
    <div className="my-8 flex justify-center">
      <Ad size={size} />
    </div>
  );
}
