import { Loader2, SearchX } from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInView } from "@/hooks/useInView";
import { getErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import type { DiscoveryUser } from "@/types/discovery";
import { UserCard } from "./UserCard";

interface UserGridProps {
  users: DiscoveryUser[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isStale?: boolean;
  hasNext: boolean;
  isFetchingNext: boolean;
  fetchNext: () => void;
  onRetry: () => void;
  emptyTitle: string;
  emptyHint: string;
}

export function UserGrid({
  users,
  isLoading,
  isError,
  error,
  isStale,
  hasNext,
  isFetchingNext,
  fetchNext,
  onRetry,
  emptyTitle,
  emptyHint,
}: UserGridProps) {
  const sentinel = useInView(fetchNext, hasNext && !isFetchingNext);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={onRetry} />;

  if (users.length === 0) {
    return (
      <div className="grid place-items-center rounded-lg border border-dashed bg-card p-12 text-center">
        <SearchX size={32} className="text-muted-foreground" />
        <p className="mt-3 font-medium">{emptyTitle}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
          isStale && "opacity-60",
        )}
      >
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      <div ref={sentinel} className="grid h-16 place-items-center">
        {isFetchingNext && <Loader2 className="animate-spin text-muted-foreground" />}
        {!hasNext && <p className="text-xs text-muted-foreground">You've reached the end.</p>}
      </div>
    </>
  );
}