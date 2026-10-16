import type { DiscoveryFilters } from "@/types/discovery";

export const EMPTY_FILTERS: DiscoveryFilters = {
  q: "",
  gender: "",
  min_age: "",
  max_age: "",
  country: "",
  state: "",
  city: "",
  language: "",
  interest: "",
  online_only: false,
};

const TEXT_KEYS = [
  "q",
  "gender",
  "min_age",
  "max_age",
  "country",
  "state",
  "city",
  "language",
  "interest",
] as const;

export const FILTER_KEYS = TEXT_KEYS.filter((k) => k !== "q");

// Filters live in the URL so refresh, back button and shared links all work.
export function readFilters(params: URLSearchParams): DiscoveryFilters {
  const f = { ...EMPTY_FILTERS };
  for (const key of TEXT_KEYS) f[key] = params.get(key) ?? "";
  f.online_only = params.get("online") === "1";
  return f;
}

export function buildParams(f: DiscoveryFilters, view: string): URLSearchParams {
  const p = new URLSearchParams();
  if (view !== "swipe") p.set("view", view);
  for (const key of TEXT_KEYS) if (f[key]) p.set(key, f[key]);
  if (f.online_only) p.set("online", "1");
  return p;
}

export function countActiveFilters(f: DiscoveryFilters): number {
  return FILTER_KEYS.filter((k) => f[k]).length + (f.online_only ? 1 : 0);
}