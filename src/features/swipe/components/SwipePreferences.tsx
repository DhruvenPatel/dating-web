import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SHOW_ME_OPTIONS } from "../prefs";
import { DEFAULT_PREFS, type SwipePrefs } from "../store";

interface SwipePreferencesProps {
  prefs: SwipePrefs;
  onSave: (prefs: SwipePrefs) => void;
  onClose: () => void;
}

// Rendered only while open, so the draft always starts from the saved values.
export function SwipePreferences({ prefs, onSave, onClose }: SwipePreferencesProps) {
  const [draft, setDraft] = useState(prefs);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const min = draft.minAge ? Number(draft.minAge) : null;
    const max = draft.maxAge ? Number(draft.maxAge) : null;

    // Same limits as the backend: 18 to 100, and min must not exceed max.
    if ([min, max].some((n) => n !== null && (n < 18 || n > 100))) {
      return setError("Age must be between 18 and 100.");
    }
    if (min !== null && max !== null && min > max) {
      return setError("Minimum age can't be greater than maximum age.");
    }
    onSave(draft);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Discovery preferences"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Discovery preferences</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose who shows up in your deck.</p>

        <div className="mt-5 space-y-4">
          <Select
            label="Show me"
            options={SHOW_ME_OPTIONS}
            value={draft.gender}
            onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min age"
              type="number"
              min={18}
              max={100}
              placeholder="18"
              value={draft.minAge}
              onChange={(e) => setDraft((d) => ({ ...d, minAge: e.target.value }))}
            />
            <Input
              label="Max age"
              type="number"
              min={18}
              max={100}
              placeholder="100"
              value={draft.maxAge}
              onChange={(e) => setDraft((d) => ({ ...d, maxAge: e.target.value }))}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Setting an age range hides people who haven't added a date of birth.
          </p>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(DEFAULT_PREFS);
              setError(null);
            }}
          >
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}