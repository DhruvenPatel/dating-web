import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GENDER_OPTIONS } from "@/features/profile/options";
import type { DiscoveryFilters } from "@/types/discovery";

const GENDERS = [{ value: "", label: "Any" }, ...GENDER_OPTIONS.slice(1)];

interface FiltersPanelProps {
  filters: DiscoveryFilters;
  onApply: (patch: Partial<DiscoveryFilters>) => void;
  onClear: () => void;
}

// The parent remounts this (via `key`) when URL filters change, so the draft
// always starts from the applied values.
export function FiltersPanel({ filters, onApply, onClear }: FiltersPanelProps) {
  const [draft, setDraft] = useState(filters);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof DiscoveryFilters>(key: K, value: DiscoveryFilters[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const apply = () => {
    const min = draft.min_age ? Number(draft.min_age) : null;
    const max = draft.max_age ? Number(draft.max_age) : null;

    // Same limits as the backend (18-100, min <= max).
    if ([min, max].some((n) => n !== null && (n < 18 || n > 100))) {
      return setError("Age must be between 18 and 100.");
    }
    if (min !== null && max !== null && min > max) {
      return setError("Minimum age can't be greater than maximum age.");
    }

    setError(null);
    onApply({
      gender: draft.gender,
      min_age: draft.min_age,
      max_age: draft.max_age,
      country: draft.country,
      state: draft.state,
      city: draft.city,
      language: draft.language,
      interest: draft.interest,
      online_only: draft.online_only,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Gender"
          options={GENDERS}
          value={draft.gender}
          onChange={(e) => set("gender", e.target.value)}
        />
        <Input
          label="Min age"
          type="number"
          min={18}
          max={100}
          placeholder="18"
          value={draft.min_age}
          onChange={(e) => set("min_age", e.target.value)}
        />
        <Input
          label="Max age"
          type="number"
          min={18}
          max={100}
          placeholder="100"
          value={draft.max_age}
          onChange={(e) => set("max_age", e.target.value)}
        />
        <Input
          label="Language"
          placeholder="e.g. Hindi"
          maxLength={50}
          value={draft.language}
          onChange={(e) => set("language", e.target.value)}
        />
        <Input
          label="Country"
          maxLength={100}
          value={draft.country}
          onChange={(e) => set("country", e.target.value)}
        />
        <Input
          label="State"
          maxLength={100}
          value={draft.state}
          onChange={(e) => set("state", e.target.value)}
        />
        <Input
          label="City"
          maxLength={100}
          value={draft.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <Input
          label="Interest"
          placeholder="e.g. Travel"
          maxLength={100}
          value={draft.interest}
          onChange={(e) => set("interest", e.target.value)}
        />
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={draft.online_only}
          onChange={(e) => set("online_only", e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        Online now
      </label>

      <p className="text-xs text-muted-foreground">
        Location, language and interest must match exactly (not case-sensitive).
      </p>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onClear}>
          Clear all
        </Button>
        <Button onClick={apply}>Apply filters</Button>
      </div>
    </div>
  );
}