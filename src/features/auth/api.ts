import { api } from "@/lib/api";
import type { ApiEnvelope, Tokens, User } from "@/types/api";

export interface RegisterPayload {
  full_name: string;
  username: string;
  email: string;
  password: string;
  date_of_birth?: string;
}

// Login is the one auth endpoint WITHOUT the {success, message, data} envelope.
export interface LoginResult {
  user: User;
  tokens: Tokens;
}

type Empty = Record<string, never>;

export const authApi = {
  register: async (payload: RegisterPayload) =>
    (
      await api.post<
        ApiEnvelope<{ user: User; email_verification_required: boolean }>
      >("/auth/register", payload)
    ).data,

  login: async (email: string, password: string) =>
    (await api.post<LoginResult>("/auth/login", { email, password })).data,

  verifyOtp: async (email: string, otp: string) =>
    (await api.post<ApiEnvelope<{ user: User }>>("/auth/verify-otp", { email, otp })).data,

  resendOtp: async (email: string) =>
    (await api.post<ApiEnvelope<Empty>>("/auth/resend-otp", { email })).data,

  forgotPassword: async (email: string) =>
    (await api.post<ApiEnvelope<Empty>>("/auth/forgot-password", { email })).data,

  resetPassword: async (token: string, new_password: string) =>
    (await api.post<ApiEnvelope<Empty>>("/auth/reset-password", { token, new_password }))
      .data,

  logout: async (refresh_token: string) =>
    (await api.post<ApiEnvelope<Empty>>("/auth/logout", { refresh_token })).data,

  me: async () => (await api.get<ApiEnvelope<{ user: User }>>("/auth/me")).data.data.user,
};