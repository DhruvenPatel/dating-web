import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFriends } from "@/features/friends/hooks";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import type { Friend } from "@/types/friends";
import type { Conversation, Message } from "@/types/chat";
import { chatApi } from "./api";
import { chatKeys } from "./keys";
import { classifyFile } from "./media";
import {
  appendMessage,
  flatten,
  loadInitial,
  refreshTail,
  type ChatData,
} from "./paging";

/* ---------------- Chat list ---------------- */

export interface ChatListItem {
  friend: Friend;
  conversation: Conversation | null;
  unread: number;
}

// There's no "list conversations" endpoint, so the list is built from the
// friends list: one cached lookup + one unread count per friend.
export function useChatOverview() {
  const friends = useFriends();
  const list = friends.data ?? [];

  const lookups = useQueries({
    queries: list.map((f) => ({
      queryKey: chatKeys.lookup(f.friend_id),
      queryFn: () => chatApi.lookupConversation(f.friend_id),
      staleTime: 60_000,
      retry: false,
      // Poll only friends with no conversation yet (they may start one).
      refetchInterval: (query: { state: { data?: Conversation | null } }) =>
        query.state.data ? false : 30_000,
    })),
  });

  const unreads = useQueries({
    queries: lookups.map((q) => ({
      queryKey: chatKeys.unread(q.data?.id ?? "none"),
      queryFn: () => chatApi.unreadCount(q.data!.id),
      enabled: !!q.data,
      refetchInterval: 15_000,
    })),
  });

  const items: ChatListItem[] = list
    .map((friend, i) => ({
      friend,
      conversation: lookups[i]?.data ?? null,
      unread: unreads[i]?.data ?? 0,
    }))
    .sort((a, b) => {
      if (a.conversation && b.conversation) {
        return b.conversation.updated_at.localeCompare(a.conversation.updated_at);
      }
      if (a.conversation) return -1;
      if (b.conversation) return 1;
      return (a.friend.full_name ?? "").localeCompare(b.friend.full_name ?? "");
    });

  return {
    items,
    totalUnread: items.reduce((sum, i) => sum + i.unread, 0),
    isLoading: friends.isLoading,
    isError: friends.isError,
    error: friends.error,
    refetch: friends.refetch,
  };
}

/* ---------------- Open a conversation ---------------- */

// Get the conversation with a friend, creating it on first use.
export function useEnsureConversation(friendId: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: chatKeys.ensure(friendId),
    retry: false,
    staleTime: Infinity,
    queryFn: async () => {
      let conversation: Conversation;
      try {
        conversation = await chatApi.getConversation(friendId);
      } catch (error) {
        if (getErrorStatus(error) !== 404) throw error;
        try {
          conversation = await chatApi.createConversation(friendId);
        } catch (createError) {
          // 409 = it was created in the meantime
          if (getErrorStatus(createError) !== 409) throw createError;
          conversation = await chatApi.getConversation(friendId);
        }
      }
      qc.setQueryData(chatKeys.lookup(friendId), conversation);
      return conversation;
    },
  });
}

/* ---------------- Messages ---------------- */

export function useMessages(conversationId: string | undefined) {
  const qc = useQueryClient();
  const key = chatKeys.messages(conversationId ?? "");
  const [loadingEarlier, setLoadingEarlier] = useState(false);

  const query = useQuery({
    queryKey: key,
    enabled: !!conversationId,
    staleTime: 0,
    refetchInterval: 4000, // pauses automatically while the tab is hidden
    queryFn: async () => {
      const prev = qc.getQueryData<ChatData>(key);
      return prev && !prev.reload
        ? refreshTail(conversationId!, prev)
        : loadInitial(conversationId!);
    },
  });

  const messages = useMemo(() => flatten(query.data), [query.data]);
  const canLoadEarlier = !!query.data && query.data.oldestPage > 1;

  const loadEarlier = useCallback(async () => {
    const data = qc.getQueryData<ChatData>(key);
    if (!conversationId || !data || data.oldestPage <= 1) return;
    setLoadingEarlier(true);
    try {
      const page = data.oldestPage - 1;
      const items = await chatApi.messagesPage(conversationId, page);
      qc.setQueryData<ChatData>(key, (prev) =>
        prev ? { ...prev, pages: { ...prev.pages, [page]: items }, oldestPage: page } : prev,
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingEarlier(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, qc]);

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    canLoadEarlier,
    loadEarlier,
    loadingEarlier,
  };
}

export function useMarkRead(conversationId: string | undefined, myId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.markRead(conversationId!),
    onSuccess: () => {
      if (!conversationId) return;
      qc.setQueryData(chatKeys.unread(conversationId), 0);
      qc.setQueryData<ChatData>(chatKeys.messages(conversationId), (prev) => {
        if (!prev) return prev;
        const pages: Record<number, Message[]> = {};
        for (const [p, items] of Object.entries(prev.pages)) {
          pages[Number(p)] = items.map((m) =>
            m.sender_id !== myId && !m.is_read ? { ...m, is_read: true } : m,
          );
        }
        return { ...prev, pages };
      });
    },
  });
}

export function useDeleteMessage(conversationId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => chatApi.deleteMessage(conversationId!, messageId),
    onSuccess: async (_data, messageId) => {
      if (!conversationId) return;
      const key = chatKeys.messages(conversationId);
      await qc.cancelQueries({ queryKey: key });
      // Deleting shifts every later message by one position, so reload cleanly.
      qc.setQueryData<ChatData>(key, (prev) => {
        if (!prev) return prev;
        const pages: Record<number, Message[]> = {};
        for (const [p, items] of Object.entries(prev.pages)) {
          pages[Number(p)] = items.filter((m) => m.id !== messageId);
        }
        return { ...prev, pages, reload: true };
      });
      qc.invalidateQueries({ queryKey: key });
      toast.success("Message deleted.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

/* ---------------- Sending (optimistic) ---------------- */

export interface PendingMessage {
  tempId: string;
  kind: "text" | "image" | "video";
  content?: string;
  file?: File;
  previewUrl?: string;
  mediaId?: string; // set once uploaded, so a retry never re-uploads
  progress: number;
  status: "sending" | "failed";
  error?: string;
}

const newTempId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useChatSend(conversationId: string | undefined) {
  const qc = useQueryClient();
  const [pending, setPending] = useState<PendingMessage[]>([]);

  const patch = useCallback((tempId: string, changes: Partial<PendingMessage>) => {
    setPending((list) => list.map((p) => (p.tempId === tempId ? { ...p, ...changes } : p)));
  }, []);

  const remove = useCallback((tempId: string) => {
    setPending((list) => {
      list.find((p) => p.tempId === tempId && p.previewUrl)?.previewUrl &&
        URL.revokeObjectURL(list.find((p) => p.tempId === tempId)!.previewUrl!);
      return list.filter((p) => p.tempId !== tempId);
    });
  }, []);

  // Free object URLs when leaving the chat.
  const latest = useRef(pending);
  latest.current = pending;
  useEffect(
    () => () => latest.current.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl)),
    [],
  );

  const process = useCallback(
    async (item: PendingMessage) => {
      if (!conversationId) return;
      patch(item.tempId, { status: "sending", progress: 0, error: undefined });
      try {
        let message: Message;
        if (item.kind === "text") {
          message = await chatApi.sendText(conversationId, item.content ?? "");
        } else {
          let mediaId = item.mediaId;
          if (!mediaId) {
            const upload = item.kind === "image" ? chatApi.uploadPhoto : chatApi.uploadVideo;
            const media = await upload(item.file as File, (p) =>
              patch(item.tempId, { progress: p }),
            );
            mediaId = media.id;
            patch(item.tempId, { mediaId });
          }
          message =
            item.kind === "image"
              ? await chatApi.sendPhoto(conversationId, mediaId)
              : await chatApi.sendVideo(conversationId, mediaId);
        }
        await appendMessage(qc, conversationId, message);
        remove(item.tempId);
      } catch (error) {
        const text = getErrorMessage(error);
        patch(item.tempId, { status: "failed", error: text });
        toast.error(text);
      }
    },
    [conversationId, patch, remove, qc],
  );

  const sendText = useCallback(
    (content: string) => {
      const item: PendingMessage = {
        tempId: newTempId(),
        kind: "text",
        content,
        progress: 0,
        status: "sending",
      };
      setPending((l) => [...l, item]);
      void process(item);
    },
    [process],
  );

  const sendFile = useCallback(
    (file: File) => {
      const result = classifyFile(file);
      if ("error" in result) return toast.error(result.error);
      const item: PendingMessage = {
        tempId: newTempId(),
        kind: result.kind,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "sending",
      };
      setPending((l) => [...l, item]);
      void process(item);
    },
    [process],
  );

  const retry = useCallback(
    (tempId: string) => {
      const item = latest.current.find((p) => p.tempId === tempId);
      if (item) void process(item);
    },
    [process],
  );

  return { pending, sendText, sendFile, retry, dismiss: remove };
}