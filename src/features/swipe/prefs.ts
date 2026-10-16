import type { SwipePrefs } from "./store";

export const SHOW_ME_OPTIONS = [
  { value: "", label: "Everyone" },
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

export function describePrefs(p: SwipePrefs): string {
  const who = SHOW_ME_OPTIONS.find((o) => o.value === p.gender)?.label ?? "Everyone";
  const age = p.minAge || p.maxAge ? `${p.minAge || 18}–${p.maxAge || 100}` : "any age";
  return `${who} · ${age}`;
}