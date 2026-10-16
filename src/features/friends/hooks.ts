import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import { useBlockedStore } from "@/store/blockedStore";
import { friendsApi } from "./api";

export const FRIENDS_KEYS = {
  all: ["friends"] as const,
  list: ["friends", "list"] as const,
  sent: ["friends", "sent"] as const,
  received: ["friends", "received"] as const,
  mutual: (id: string) => ["friends", "mutual", id] as const,
};

export const useFriends = () =>
  useQuery({ queryKey: FRIENDS_KEYS.list, queryFn: friendsApi.list });

export const useSentRequests = () =>
  useQuery({ queryKey: FRIENDS_KEYS.sent, queryFn: friendsApi.sent });

// Polled so the sidebar badge notices new incoming requests.
export const useReceivedRequests = () =>
  useQuery({
    queryKey: FRIENDS_KEYS.received,
    queryFn: friendsApi.received,
    refetchInterval: 30_000,
  });

export function useMutualFriends(userId: string, enabled = true) {
  return useQuery({
    queryKey: FRIENDS_KEYS.mutual(userId),
    queryFn: () => friendsApi.mutual(userId),
    enabled: enabled && !!userId,
  });
}

export type RelationStatus = "none" | "friends" | "pending_sent" | "pending_received";
export interface Relation {
  status: RelationStatus;
  requestId?: string;
}

// The discovery endpoints always report "none", so the real relationship
// is derived from three cached lists (no per-card requests).
export function useRelationships() {
  const friends = useFriends();
  const sent = useSentRequests();
  const received = useReceivedRequests();

  const map = useMemo(() => {
    const m = new Map<string, Relation>();
    sent.data?.forEach((r) => {
      if (r.status === "pending") m.set(r.receiver_id, { status: "pending_sent", requestId: r.id });
    });
    received.data?.forEach((r) => {
      if (r.status === "pending")
        m.set(r.sender_id, { status: "pending_received", requestId: r.id });
    });
    // GET /friends items use `friend_id`
    friends.data?.forEach((f) => m.set(f.friend_id, { status: "friends" }));
    return m;
  }, [friends.data, sent.data, received.data]);

  return {
    isLoading: friends.isLoading || sent.isLoading || received.isLoading,
    get: (userId: string): Relation => map.get(userId) ?? { status: "none" },
  };
}

function useFriendMutation<TVars>(
  fn: (vars: TVars) => Promise<unknown>,
  successMessage: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FRIENDS_KEYS.all });
      toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      // The server may know something we don't (e.g. the request already exists).
      qc.invalidateQueries({ queryKey: FRIENDS_KEYS.all });
    },
  });
}

export const useSendRequest = () =>
  useFriendMutation((id: string) => friendsApi.sendRequest(id), "You liked them.");
export const useCancelRequest = () =>
  useFriendMutation((id: string) => friendsApi.cancelRequest(id), "Like withdrawn.");
export const useAcceptRequest = () =>
  useFriendMutation((id: string) => friendsApi.acceptRequest(id), "It's a match!");
export const useRejectRequest = () =>
  useFriendMutation((id: string) => friendsApi.rejectRequest(id), "Passed.");

/* ---------------- Blocking ---------------- */

export interface BlockTarget {
  id: string;
  name: string;
  username: string | null;
  pictureUrl: string | null;
}

export function useIsBlocked(userId: string): boolean {
  const me = useAuthStore((s) => s.user?.id);
  return useBlockedStore((s) => s.entries.some((e) => e.ownerId === me && e.userId === userId));
}

export function useMyBlocked() {
  const me = useAuthStore((s) => s.user?.id);
  const entries = useBlockedStore((s) => s.entries);
  return useMemo(() => entries.filter((e) => e.ownerId === me), [entries, me]);
}

export function useBlockUser() {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user?.id);
  const add = useBlockedStore((s) => s.add);

  return useMutation({
    mutationFn: async (target: BlockTarget) => {
      try {
        await friendsApi.block(target.id);
      } catch (error) {
        // 409 = already blocked: that's the state we want anyway.
        if (getErrorStatus(error) !== 409) throw error;
      }
      return target;
    },
    onSuccess: (target) => {
      if (me) {
        add({
          ownerId: me,
          userId: target.id,
          name: target.name,
          username: target.username,
          pictureUrl: target.pictureUrl,
          blockedAt: new Date().toISOString(),
        });
      }
      qc.invalidateQueries({ queryKey: FRIENDS_KEYS.all });
      qc.invalidateQueries({ queryKey: ["discovery"] });
      toast.success(`${target.name} has been blocked.`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user?.id);
  const remove = useBlockedStore((s) => s.remove);

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        await friendsApi.unblock(userId);
      } catch (error) {
        // 404 = not blocked (anymore): clean up our local record.
        if (getErrorStatus(error) !== 404) throw error;
      }
      return userId;
    },
    onSuccess: (userId) => {
      if (me) remove(me, userId);
      qc.invalidateQueries({ queryKey: ["discovery"] });
      toast.success("User unblocked. You'll need to like each other again.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}