import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { getErrorMessage } from "@/lib/errors";
import type { NotificationPreferences } from "@/types/notifications";
import { usePreferences, useUpdatePreferences } from "../hooks";

const ROWS: {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
  note?: string;
}[] = [
    {
    key: "friend_request",
    label: "New likes",
    description: "When someone likes you.",
  },
  {
    key: "friend_request_accepted",
    label: "New matches",
    description: "When someone likes you back.",
  },
  {
    key: "new_message",
    label: "New messages",
    description: "When a friend sends you a message.",
    note: "The server doesn't send message notifications yet, but your choice is saved.",
  },
];

export function PreferencesPanel() {
  const { data, isLoading, isError, error, refetch } = usePreferences();
  const update = useUpdatePreferences();

  if (isLoading) return <Skeleton className="h-60" />;
  if (isError || !data) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  return (
    <div className="divide-y rounded-lg border bg-card">
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4 p-5 sm:px-8">
          <div>
            <p className="text-sm font-medium">{row.label}</p>
            <p className="text-sm text-muted-foreground">{row.description}</p>
            {row.note && <p className="mt-1 text-xs text-muted-foreground">{row.note}</p>}
          </div>
          <Switch
            label={row.label}
            checked={data[row.key]}
            onChange={(checked) => update.mutate({ [row.key]: checked })}
          />
        </div>
      ))}
    </div>
  );
}