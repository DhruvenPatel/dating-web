import { useQueryClient } from "@tanstack/react-query";
import { friendsApi } from "@/features/friends/api";
import { FRIENDS_KEYS, type Relation } from "@/features/friends/hooks";
import { getErrorStatus } from "@/lib/errors";
import type { DiscoveryUser } from "@/types/discovery";

export type LikeResult = "liked" | "match";

export function useSwipeActions() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: FRIENDS_KEYS.all });

  // A like is a friend request. If they already liked you, accepting
  // their request is what makes it a match.
  const like = async (user: DiscoveryUser, relation: Relation): Promise<LikeResult> => {
    try {
      if (relation.status === "pending_received" && relation.requestId) {
        await friendsApi.acceptRequest(relation.requestId);
        return "match";
      }
      await friendsApi.sendRequest(user.id);
      return "liked";
    } catch (error) {
      if (getErrorStatus(error) === 409) {
        // Our cached data was stale. Ask the server what's really going on.
        const received = await qc.fetchQuery({
          queryKey: FRIENDS_KEYS.received,
          queryFn: friendsApi.received,
          staleTime: 0,
        });
        const incoming = received.find((r) => r.sender_id === user.id && r.status === "pending");
        if (incoming) {
          await friendsApi.acceptRequest(incoming.id);
          return "match";
        }
        return "liked"; // you'd already liked them
      }
      throw error;
    } finally {
      refresh();
    }
  };

  // Undo a like = cancel the pending request.
  const undoLike = async (user: DiscoveryUser) => {
    const sent = await qc.fetchQuery({
      queryKey: FRIENDS_KEYS.sent,
      queryFn: friendsApi.sent,
      staleTime: 0,
    });
    const request = sent.find((r) => r.receiver_id === user.id && r.status === "pending");
    if (!request) throw new Error("This like can't be undone anymore.");
    await friendsApi.cancelRequest(request.id);
    refresh();
  };

  return { like, undoLike };
}