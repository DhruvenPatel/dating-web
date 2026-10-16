import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useUpdatePrivacy } from "@/features/profile/hooks";
import { PRIVACY_FIELDS } from "@/features/profile/options";
import type { PrivacySettings } from "@/types/profile";

// The parent passes key={privacy.updated_at}, so this remounts with fresh values after a save.
export function PrivacyForm({ privacy }: { privacy: PrivacySettings }) {
  const update = useUpdatePrivacy();
  const [draft, setDraft] = useState<PrivacySettings>({ ...privacy });

  const changed = PRIVACY_FIELDS.filter((f) => draft[f.key] !== privacy[f.key]);

  const save = () => {
    // Send only what changed.
    const payload = Object.fromEntries(changed.map((f) => [f.key, draft[f.key]]));
    update.mutate(payload);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-5 sm:px-8">
        <h3 className="text-lg font-semibold">Privacy</h3>
        <p className="text-sm text-muted-foreground">Control who can see and contact you.</p>
      </div>

      <div className="divide-y">
        {PRIVACY_FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div>
              <p className="text-sm font-medium">{f.label}</p>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
            <div className="sm:w-52">
              <Select
                id={f.key}
                label={f.label}
                hideLabel
                options={f.options}
                value={draft[f.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t p-5 sm:px-8">
        <Button
          variant="outline"
          disabled={!changed.length || update.isPending}
          onClick={() => setDraft({ ...privacy })}
        >
          Discard
        </Button>
        <Button disabled={!changed.length} loading={update.isPending} onClick={save}>
          Save changes
        </Button>
      </div>
    </div>
  );
}