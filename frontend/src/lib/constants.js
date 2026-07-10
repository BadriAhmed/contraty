export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const DOMAINS = {
  logement: { ar: "سكن", fr: "Logement", icon: "Home" },
  travail: { ar: "عمل", fr: "Travail", icon: "Briefcase" },
  argent: { ar: "مال وقرض", fr: "Argent & Prêt", icon: "Coins" },
  vehicules: { ar: "عربات", fr: "Véhicules", icon: "Car" },
  entreprise: { ar: "مؤسسة", fr: "Entreprise", icon: "Building2" },
  demarches: { ar: "إجراءات", fr: "Démarches", icon: "FileText" },
};

export async function fetchTemplates({ domain, language } = {}) {
  try {
    const params = new URLSearchParams();
    if (domain) params.set("domain", domain);
    if (language) params.set("language", language);
    const res = await fetch(`${API_BASE}/contracts/templates?${params}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchTemplate(slug) {
  try {
    const res = await fetch(`${API_BASE}/contracts/templates/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
