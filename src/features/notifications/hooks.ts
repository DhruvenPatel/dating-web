import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePublicProfile } from "@/features/discovery/hooks";
import { useFriends, useReceivedRequests } from "@/features/friends/hooks";
import { personName } from "@/features/friends/utils";
import { getErrorMessage } from "@/lib/errors";
import type { NotificationPreferences } from "@/types/notifications";
import { notificationsApi } from "./api";

const KEYS = {
  list: (unreadOnly: boolean) => ["notifications", "list", unreadOnly] as const,
  listAll: ["notifications", "list"] as const,
  unread: ["notifications", "unread"] as const,
  prefs: ["notifications", "prefs"] as const,
};

const onError = (e: unknown) => toast.error(getErrorMessage(e));

export function useNotifications(unreadOnly: boolean) {
  return useInfiniteQuery({
    queryKey: KEYS.list(unreadOnly),
    queryFn: ({ pageParam }) => notificationsApi.list(pageParam, unreadOnly),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.has_more ? (last.next_skip ?? undefined) : undefined),
    refetchInterval: 30_000,
  });
}

// Polled so the sidebar badge stays fresh.
export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: KEYS.unread,
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 30_000,
  });
}

function useRefreshNotifications() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: KEYS.listAll });
    qc.invalidateQueries({ queryKey: KEYS.unread });
  };
}

export function useMarkNotificationRead() {
  const refresh = useRefreshNotifications();
  return useMutation({ mutationFn: notificationsApi.markRead, onSuccess: refresh, onError });
}

export function useMarkNotificationUnread() {
  const refresh = useRefreshNotifications();
  return useMutation({ mutationFn: notificationsApi.markUnread, onSuccess: refresh, onError });
}

export function useMarkAllRead() {
  const refresh = useRefreshNotifications();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      refresh();
      toast.success("All notifications marked as read.");
    },
    onError,
  });
}

export function useDeleteNotification() {
  const refresh = useRefreshNotifications();
  return useMutation({ mutationFn: notificationsApi.remove, onSuccess: refresh, onError });
}

export function useDeleteAllNotifications() {
  const refresh = useRefreshNotifications();
  return useMutation({
    mutationFn: notificationsApi.removeAll,
    onSuccess: () => {
      refresh();
      toast.success("All notifications deleted.");
    },
    onError,
  });
}

export function usePreferences() {
  return useQuery({ queryKey: KEYS.prefs, queryFn: notificationsApi.getPreferences });
}

// Optimistic: the switch flips instantly and rolls back if the server refuses.
export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<NotificationPreferences>) =>
      notificationsApi.updatePreferences(patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: KEYS.prefs });
      const previous = qc.getQueryData<NotificationPreferences>(KEYS.prefs);
      if (previous) qc.setQueryData(KEYS.prefs, { ...previous, ...patch });
      return { previous };
    },
    onError: (error, _patch, context) => {
      if (context?.previous) qc.setQueryData(KEYS.prefs, context.previous);
      toast.error(getErrorMessage(error));
    },
    onSuccess: (preferences) => qc.setQueryData(KEYS.prefs, preferences),
  });
}

// Notifications carry only a sender id. Resolve the name from caches we
// already have; only fetch the public profile as a last resort.
export function useSender(senderId: string | null) {
  const friends = useFriends();
  const received = useReceivedRequests();

  const fromFriend = friends.data?.find((f) => f.friend_id === senderId);
  const fromRequest = received.data?.find((r) => r.sender_id === senderId)?.sender;
  const known = fromFriend ?? fromRequest;
  const listsReady = !friends.isLoading && !received.isLoading;

  const profile = usePublicProfile(senderId ?? "", !!senderId && listsReady && !known);

  if (known) {
    return { name: personName(known), pictureUrl: known.profile_picture?.url ?? null };
  }
  if (profile.data) {
    return {
      name: profile.data.profile.display_name || profile.data.full_name,
      pictureUrl: profile.data.profile.profile_picture?.url ?? null,
    };
  }
  return { name: null, pictureUrl: null };
}