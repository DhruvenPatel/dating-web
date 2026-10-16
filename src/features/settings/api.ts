import { api } from "@/lib/api";

export const settingsApi = {
  changePassword: async (current_password: string, new_password: string) => {
    await api.post("/auth/change-password", { current_password, new_password });
  },
};