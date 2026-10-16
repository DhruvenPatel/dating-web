import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { personName } from "@/features/friends/utils";
import { timeAgo } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { useChatOverview } from "../hooks";

export function ConversationList({ activeId }: { activeId?: string }) {
  const { items, isLoading, isError, error, refetch } = useChatOverview();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? items.filter(
        (i) =>
          personName(i.friend).toLowerCase().includes(q) ||
          (i.friend.username ?? "").toLowerCase().includes(q),
      )
    : items;

  return (
    <>
      <div className="space-y-3 border-b p-4">
        <h2 className="text-lg font-bold tracking-tight">Messages</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search matches..."
            className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-3">
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-3">
            <EmptyState
              icon={<Users size={28} />}
              title="No matches to chat with"
              hint="Match with someone first, then you can message them here."
              action={
                <Link
                  to="/discover"
                  className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                 Start swiping
                </Link>
              }
            />
          </div>
        ) : visible.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No matches found.</p>
        ) : (
          visible.map(({ friend, conversation, unread }) => {
            const name = personName(friend);
            return (
              <Link
                key={friend.friend_id}
                to={`/chat/${friend.friend_id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition hover:bg-muted",
                  activeId === friend.friend_id && "bg-muted",
                )}
              >
                <Avatar src={friend.profile_picture?.url} name={name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", unread > 0 ? "font-bold" : "font-semibold")}>
                    {name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation ? `Active ${timeAgo(conversation.updated_at)}` : "Start a conversation"}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}