import { Info, ShieldOff } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { timeAgo } from "@/lib/date";
import { useMyBlocked } from "../hooks";
import { BlockButton } from "./BlockButton";
import { PersonRow } from "./PersonRow";

export function BlockedList() {
  const blocked = useMyBlocked();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p>
          This list shows people you blocked from this browser. The server doesn't provide a full
          blocked-users list yet.
        </p>
      </div>

      {blocked.length === 0 ? (
        <EmptyState
          icon={<ShieldOff size={32} />}
          title="No blocked users"
          hint="People you block will appear here so you can unblock them later."
        />
      ) : (
        <div className="divide-y rounded-lg border bg-card">
          {[...blocked]
            .sort((a, b) => b.blockedAt.localeCompare(a.blockedAt))
            .map((b) => (
              <PersonRow
                key={b.userId}
                userId={b.userId}
                name={b.name}
                username={b.username}
                pictureUrl={b.pictureUrl}
                subtitle={`Blocked ${timeAgo(b.blockedAt)}`}
                actions={
                  <BlockButton
                    target={{
                      id: b.userId,
                      name: b.name,
                      username: b.username,
                      pictureUrl: b.pictureUrl,
                    }}
                  />
                }
              />
            ))}
        </div>
      )}
    </div>
  );
}