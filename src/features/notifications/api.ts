import { api } from "@/lib/api";
import type {
  NotificationPreferences,
  NotificationsPage,
} from "@/types/notifications";

// Notification endpoints return bare objects (no {success, data} envelope).
export const notificationsApi = {
  list: async (skip: number, unreadOnly: boolean) =>
    (
      await api.get<NotificationsPage>("/notifications", {
        params: { skip, limit: 20, unread_only: unreadOnly },
      })
    ).data,

  unreadCount: async () =>
    (await api.get<{ unread_count: number }>("/notifications/unread-count")).data.unread_count,

  markRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markUnread: async (id: string) => {
    await api.patch(`/notifications/${id}/unread`);
  },

  markAllRead: async () => {
    await api.patch("/notifications/read-all");
  },

  remove: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  },

  removeAll: async () => {
    await api.delete("/notifications");
  },

  getPreferences: async () =>
    (await api.get<{ preferences: NotificationPreferences }>("/notifications/preferences")).data
      .preferences,

  updatePreferences: async (patch: Partial<NotificationPreferences>) =>
    (
      await api.patch<{ preferences: NotificationPreferences }>(
        "/notifications/preferences",
        patch,
      )
    ).data.preferences,
};