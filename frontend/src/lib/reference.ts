import { API_BASE } from "@/lib/constants";

export type ReferenceKind =
  | "governorates"
  | "cities"
  | "places"
  | "tribunals"
  | "nationalities"
  | "professions"
  | "carburants";

const cache = new Map<ReferenceKind, Promise<{ fr: string[]; ar: string[] }>>();

// Templates may reference legacy autocomplete aliases; normalize them to the
// canonical kinds accepted by the backend reference endpoint.
const ALIASES: Record<string, ReferenceKind> = {
  "tn-place": "places",
  "tn-tribunal": "tribunals",
  profession: "professions",
  nationality: "nationalities",
};

export function normalizeReferenceKind(kind: string): ReferenceKind {
  return ALIASES[kind] ?? (kind as ReferenceKind);
}

export function fetchReference(kind: ReferenceKind): Promise<{ fr: string[]; ar: string[] }> {
  const canonical = normalizeReferenceKind(kind);
  if (!cache.has(canonical)) {
    const p = fetch(`${API_BASE}/contracts/reference/${canonical}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { fr: [], ar: [] }))
      .catch(() => ({ fr: [], ar: [] }));
    cache.set(canonical, p);
  }
  return cache.get(canonical)!;
}

/** Years list for vehicle registration year fields. */
export function yearOptions(from = 1980): string[] {
  const current = new Date().getFullYear() + 1;
  const years: string[] = [];
  for (let y = current; y >= from; y--) years.push(String(y));
  return years;
}
