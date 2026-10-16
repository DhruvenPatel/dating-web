import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Search, SearchX, Users } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMonthYear } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import { useFriends } from "../hooks";
import { personName } from "../utils";
import { BlockButton } from "./BlockButton";
import { PersonRow } from "./PersonRow";

export function FriendsList() {
  const { data, isLoading, isError, error, refetch } = useFriends();
  const [query, setQuery] = useState("");

  const friends = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...(data ?? [])].sort((a, b) => personName(a).localeCompare(personName(b)));
    if (!q) return sorted;
    return sorted.filter(
      (f) =>
        personName(f).toLowerCase().includes(q) || (f.username ?? "").toLowerCase().includes(q),
    );
  }, [data, query]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[74px]" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (!data?.length) {
    return (
      <EmptyState
        icon={<Users size={32} />}
        title="No matches yet"
        hint="Swipe through Discover. When you like each other, it's a match."
        action={
          <Link
            to="/discover"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
           Start swiping
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your matches..."
          className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {friends.length === 0 ? (
        <EmptyState icon={<SearchX size={32} />} title="No matches found" />
      ) : (
        <div className="divide-y rounded-lg border bg-card">
          {friends.map((f) => {
            const name = personName(f);
            return (
              <PersonRow
                key={f.friend_id}
                userId={f.friend_id}
                name={name}
                username={f.username}
                pictureUrl={f.profile_picture?.url}
                verified={f.is_verified}
                online={f.is_online}
                subtitle={f.friends_since ? `Matched ${formatMonthYear(f.friends_since)}` : undefined}
                actions={
                  <>
                    <Link
                      to={`/chat?with=${f.friend_id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                    >
                      <MessageCircle size={14} /> Message
                    </Link>
                    <BlockButton
                      target={{
                        id: f.friend_id,
                        name,
                        username: f.username,
                        pictureUrl: f.profile_picture?.url ?? null,
                      }}
                    />
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}