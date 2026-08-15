type Variant = "simple" | "legal" | "bilingual" | "secure";

export default function FeatureIllustration({ variant }: { variant: Variant }) {
  if (variant === "simple") {
    return (
      <svg viewBox="0 0 320 240" fill="none" role="img" aria-label="Simple et rapide">
        <rect width="320" height="240" rx="20" fill="#E0F5FF" />
        <rect x="72" y="36" width="124" height="168" rx="12" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
        <rect x="92" y="66" width="84" height="9" rx="4.5" fill="#dbeafe" />
        <rect x="92" y="88" width="56" height="9" rx="4.5" fill="#dbeafe" />
        <rect x="92" y="110" width="70" height="9" rx="4.5" fill="#dbeafe" />
        <path d="M102 150 l12 12 l22 -26" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="214" cy="80" r="34" fill="#0ea5e9" />
        <path d="M201 80 l9 9 l18 -20" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M236 132 l-13 22 h10 l-6 16 l20 -26 h-11 l7 -12 z" fill="#fbbf24" />
      </svg>
    );
  }

  if (variant === "legal") {
    return (
      <svg viewBox="0 0 320 240" fill="none" role="img" aria-label="Expertise juridique">
        <rect width="320" height="240" rx="20" fill="#E7F6EC" />
        <rect x="160" y="36" width="6" height="120" rx="3" fill="#16a34a" />
        <circle cx="160" cy="164" r="7" fill="#16a34a" />
        <path d="M96 52 h128 l-20 22 h-88 z" fill="#16a34a" />
        <path d="M96 188 h128 l-20 -22 h-88 z" fill="#16a34a" />
        <path d="M96 52 L128 74 L116 82 L92 58 Z" fill="#16a34a" />
        <path d="M224 52 L192 74 L204 82 L228 58 Z" fill="#16a34a" />
        <path d="M96 188 L128 166 L116 158 L92 182 Z" fill="#16a34a" />
        <path d="M224 188 L192 166 L204 158 L228 182 Z" fill="#16a34a" />
        <rect x="60" y="180" width="52" height="24" rx="6" fill="#16a34a" opacity="0.25" />
        <rect x="208" y="180" width="52" height="24" rx="6" fill="#16a34a" opacity="0.25" />
      </svg>
    );
  }

  if (variant === "bilingual") {
    return (
      <svg viewBox="0 0 320 240" fill="none" role="img" aria-label="Bilingue">
        <rect width="320" height="240" rx="20" fill="#F1EBFE" />
        <rect x="56" y="60" width="110" height="80" rx="18" fill="#8b5cf6" />
        <path d="M86 140 L96 168 L126 140 Z" fill="#8b5cf6" />
        <text x="111" y="110" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="700" fill="#ffffff" textAnchor="middle">FR</text>
        <rect x="154" y="96" width="110" height="80" rx="18" fill="#ffffff" stroke="#8b5cf6" strokeWidth="3" />
        <path d="M184 176 L194 204 L224 176 Z" fill="#ffffff" stroke="#8b5cf6" strokeWidth="3" />
        <text x="209" y="146" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="700" fill="#8b5cf6" textAnchor="middle">ع</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" fill="none" role="img" aria-label="Sécurisé et privé">
      <rect width="320" height="240" rx="20" fill="#E3EDFF" />
      <path d="M160 40 L224 66 V126 C224 166 196 194 160 206 C124 194 96 166 96 126 V66 Z" fill="#3b82f6" />
      <rect x="140" y="106" width="40" height="32" rx="8" fill="#ffffff" />
      <path d="M148 106 v-8 a12 12 0 0 1 24 0 v8" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="160" cy="122" r="4" fill="#3b82f6" />
      <path d="M160 124 v6" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
