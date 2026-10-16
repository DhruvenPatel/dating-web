import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, HeartOff, Send, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { friendsApi } from "@/features/friends/api";
import {
  FRIENDS_KEYS,
  useCancelRequest,
  useReceivedRequests,
  useRejectRequest,
  useSentRequests,
} from "@/features/friends/hooks";
import { personName } from "@/features/friends/utils";
import { MatchModal, type MatchPerson } from "@/features/swipe/components/MatchModal";
import { useMyProfile } from "@/features/profile/hooks";
import { timeAgo } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import { LikeCard, type LikePerson } from "../components/LikeCard";

type LikesTab = "received" | "sent";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="aspect-[3/4]" />
      ))}
    </div>
  );
}

export function LikesPage() {
  const [params, setParams] = useSearchParams();
  const tab: LikesTab = params.get("tab") === "sent" ? "sent" : "received";

  const qc = useQueryClient();
  const { data: me } = useMyProfile();
  const received = useReceivedRequests();
  const sent = useSentRequests();
  const reject = useRejectRequest();
  const cancel = useCancelRequest();
  const [match, setMatch] = useState<MatchPerson | null>(null);
  const closeMatch = useCallback(() => setMatch(null), []);

  // Liking someone back = accepting their request, and that's the match.
  const accept = useMutation({
    mutationFn: (requestId: string) => friendsApi.acceptRequest(requestId),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => qc.invalidateQueries({ queryKey: FRIENDS_KEYS.all }),
  });

  const likeBack = (requestId: string, person: LikePerson) =>
    accept.mutate(requestId, { onSuccess: () => setMatch(person) });

  const incoming = (received.data ?? []).filter((r) => r.status === "pending");
  const outgoing = (sent.data ?? []).filter((r) => r.status === "pending");

  const tabs: { value: LikesTab; label: string }[] = [
    { value: "received", label: `Likes you${incoming.length ? ` (${incoming.length})` : ""}` },
    { value: "sent", label: `You liked${outgoing.length ? ` (${outgoing.length})` : ""}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Likes</h2>
        <p className="text-sm text-muted-foreground">
          People who like you. Like them back to match.
        </p>
      </div>

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => setParams(t === "received" ? {} : { tab: t }, { replace: true })}
      />

      {tab === "received" ? (
        received.isLoading ? (
          <GridSkeleton />
        ) : received.isError ? (
          <ErrorState message={getErrorMessage(received.error)} onRetry={() => received.refetch()} />
        ) : incoming.length === 0 ? (
          <EmptyState
            icon={<HeartOff size={32} />}
            title="No likes yet"
            hint="Keep swiping and add a photo and bio to your profile. People notice complete profiles."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {incoming.map((r) => (
              <LikeCard
                key={r.id}
                userId={r.sender_id}
                fallbackName={personName(r.sender)}
                caption={`Liked you ${timeAgo(r.created_at)}`}
                actions={(person) => (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      aria-label={`Pass on ${person.name}`}
                      loading={reject.isPending && reject.variables === r.id}
                      disabled={accept.isPending && accept.variables === r.id}
                      onClick={() => reject.mutate(r.id)}
                    >
                      <X size={15} /> Pass
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      aria-label={`Like ${person.name} back`}
                      loading={accept.isPending && accept.variables === r.id}
                      disabled={reject.isPending && reject.variables === r.id}
                      onClick={() => likeBack(r.id, person)}
                    >
                      <Heart size={14} fill="currentColor" /> Like back
                    </Button>
                  </>
                )}
              />
            ))}
          </div>
        )
      ) : sent.isLoading ? (
        <GridSkeleton />
      ) : sent.isError ? (
        <ErrorState message={getErrorMessage(sent.error)} onRetry={() => sent.refetch()} />
      ) : outgoing.length === 0 ? (
        <EmptyState
          icon={<Send size={32} />}
          title="You haven't liked anyone yet"
          hint="Swipe right on someone in Discover. Your pending likes will wait here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {outgoing.map((r) => (
            <LikeCard
              key={r.id}
              userId={r.receiver_id}
              fallbackName={personName(r.receiver)}
              caption={`You liked ${timeAgo(r.created_at)}`}
              actions={() => (
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  loading={cancel.isPending && cancel.variables === r.id}
                  onClick={() => cancel.mutate(r.id)}
                >
                  Undo like
                </Button>
              )}
            />
          ))}
        </div>
      )}

      <MatchModal
        them={match}
        meName={me?.profile.display_name || me?.user.full_name || "You"}
        mePicture={me?.profile.profile_picture?.url}
        onClose={closeMatch}
      />
    </div>
  );
}