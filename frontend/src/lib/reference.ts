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

export function fetchReference(kind: ReferenceKind): Promise<{ fr: string[]; ar: string[] }> {
  if (!cache.has(kind)) {
    const p = fetch(`${API_BASE}/contracts/reference/${kind}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { fr: [], ar: [] }))
      .catch(() => ({ fr: [], ar: [] }));
    cache.set(kind, p);
  }
  return cache.get(kind)!;
}

/** Years list for vehicle registration year fields. */
export function yearOptions(from = 1980): string[] {
  const current = new Date().getFullYear() + 1;
  const years: string[] = [];
  for (let y = current; y >= from; y--) years.push(String(y));
  return years;
}
