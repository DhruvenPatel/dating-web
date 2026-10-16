import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api";
import type { Friend, FriendUser, ReceivedRequest, SentRequest } from "@/types/friends";

export const friendsApi = {
  list: async () => (await api.get<ApiEnvelope<Friend[]>>("/friends")).data.data,

  sent: async () =>
    (await api.get<ApiEnvelope<SentRequest[]>>("/friends/requests/sent")).data.data,

  received: async () =>
    (await api.get<ApiEnvelope<ReceivedRequest[]>>("/friends/requests/received")).data.data,

  sendRequest: async (receiverId: string) =>
    (
      await api.post<ApiEnvelope<{ id: string }>>("/friends/requests", {
        receiver_id: receiverId,
      })
    ).data.data,

  cancelRequest: async (requestId: string) => {
    await api.post(`/friends/requests/${requestId}/cancel`);
  },

  acceptRequest: async (requestId: string) => {
    await api.post(`/friends/requests/${requestId}/accept`);
  },

  rejectRequest: async (requestId: string) => {
    await api.post(`/friends/requests/${requestId}/reject`);
  },

  mutual: async (userId: string) =>
    (await api.get<ApiEnvelope<FriendUser[]>>(`/friends/mutual/${userId}`)).data.data,

  block: async (userId: string) => {
    await api.post(`/friends/block/${userId}`);
  },

  unblock: async (userId: string) => {
    await api.delete(`/friends/block/${userId}`);
  },
};