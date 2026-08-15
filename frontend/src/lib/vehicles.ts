import { API_BASE } from "@/lib/constants";

export interface VehicleBrand {
  brand: string;
  models: string[];
}

let cache: Promise<VehicleBrand[]> | null = null;

export function fetchVehicles(): Promise<VehicleBrand[]> {
  if (!cache) {
    cache = fetch(`${API_BASE}/contracts/vehicles`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);
  }
  return cache;
}
