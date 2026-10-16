import { api } from "@/lib/api";
import { getErrorStatus } from "@/lib/errors";
import type { ApiEnvelope } from "@/types/api";
import type { Conversation, MediaItem, Message } from "@/types/chat";

export const PAGE_LIMIT = 100; // backend maximum

async function getConversation(friendId: string): Promise<Conversation> {
  return (await api.get<ApiEnvelope<Conversation>>(`/chat/conversations/${friendId}`)).data.data;
}

async function createConversation(friendId: string): Promise<Conversation> {
  return (
    await api.post<ApiEnvelope<Conversation>>("/chat/conversations", { friend_id: friendId })
  ).data.data;
}

// For the chat list: "no conversation yet" is a normal state, not an error.
async function lookupConversation(friendId: string): Promise<Conversation | null> {
  try {
    return await getConversation(friendId);
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 404 || status === 403) return null;
    throw error;
  }
}

async function upload(path: string, file: File, onProgress?: (percent: number) => void) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<ApiEnvelope<MediaItem>>(path, form, {
    timeout: 10 * 60 * 1000, // videos can be large
    onUploadProgress: (e) => {
      if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
    },
  });
  return res.data.data;
}

export const chatApi = {
  getConversation,
  createConversation,
  lookupConversation,

  // The messages endpoint returns { page, limit, data } with no total.
  messagesPage: async (conversationId: string, page: number): Promise<Message[]> =>
    (
      await api.get<{ data: Message[] }>(`/chat/conversations/${conversationId}/messages`, {
        params: { page, limit: PAGE_LIMIT },
      })
    ).data.data,

  sendText: async (conversationId: string, content: string) =>
    (
      await api.post<ApiEnvelope<Message>>(`/chat/conversations/${conversationId}/messages`, {
        content,
      })
    ).data.data,

  uploadPhoto: (file: File, onProgress?: (p: number) => void) =>
    upload("/media/photos", file, onProgress),
  uploadVideo: (file: File, onProgress?: (p: number) => void) =>
    upload("/media/videos", file, onProgress),

  sendPhoto: async (conversationId: string, mediaId: string) =>
    (
      await api.post<ApiEnvelope<Message>>(`/chat/conversations/${conversationId}/messages/photo`, {
        media_id: mediaId,
      })
    ).data.data,

  sendVideo: async (conversationId: string, mediaId: string) =>
    (
      await api.post<ApiEnvelope<Message>>(`/chat/conversations/${conversationId}/messages/video`, {
        media_id: mediaId,
      })
    ).data.data,

  markRead: async (conversationId: string) => {
    await api.patch(`/chat/conversations/${conversationId}/read`);
  },

  unreadCount: async (conversationId: string) =>
    (
      await api.get<ApiEnvelope<{ unread_count: number }>>(
        `/chat/conversations/${conversationId}/unread-count`,
      )
    ).data.data.unread_count,

  deleteMessage: async (conversationId: string, messageId: string) => {
    await api.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
  },
};