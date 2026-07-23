import type { Template, FieldMeta } from "@/types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const DOMAINS: Record<string, { ar: string; fr: string; icon: string }> = {
  logement: { ar: "سكن", fr: "Logement", icon: "Home" },
  travail: { ar: "عمل", fr: "Travail", icon: "Briefcase" },
  argent: { ar: "مال وقرض", fr: "Argent & Prêt", icon: "Coins" },
  vehicules: { ar: "عربات", fr: "Véhicules", icon: "Car" },
  entreprise: { ar: "مؤسسة", fr: "Entreprise", icon: "Building2" },
  demarches: { ar: "إجراءات", fr: "Démarches", icon: "FileText" },
};

export async function fetchTemplates(params?: { domain?: string; language?: string }): Promise<Template[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.domain) searchParams.set("domain", params.domain);
    if (params?.language) searchParams.set("language", params.language);
    const res = await fetch(`${API_BASE}/contracts/templates?${searchParams}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchTemplate(slug: string): Promise<Template | null> {
  try {
    const res = await fetch(`${API_BASE}/contracts/templates/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function validateField(value: string, meta: FieldMeta | null): string | null {
  if (!meta) return null;
  const trimmed = (value || "").trim();
  if (meta.required && !trimmed) return "required";

  if (trimmed && meta.pattern) {
    try {
      const re = new RegExp(meta.pattern);
      if (!re.test(trimmed)) return "pattern";
    } catch {
      /* invalid regex from backend, skip */
    }
  }

  if (trimmed && meta.min_length && trimmed.length < meta.min_length) return "min_length";
  if (trimmed && meta.max_length && trimmed.length > meta.max_length) return "max_length";

  if (trimmed && (meta.type === "number" || meta.type === "percentage")) {
    const n = parseFloat(trimmed.replace(",", "."));
    if (isNaN(n)) return "format";
    if (meta.min_value !== undefined && meta.min_value !== null && n < meta.min_value) return "min_value";
    if (meta.max_value !== undefined && meta.max_value !== null && n > meta.max_value) return "max_value";
  }

  return null;
}
