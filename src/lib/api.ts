import axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000,
});

// Auth endpoints that must never trigger a refresh-and-retry.
const NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/send-otp",
  "/auth/resend-otp",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
];

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refresh token");

  // Plain axios (not `api`) so this call skips our own interceptors.
  const res = await axios.post(`${env.API_BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });

  const { access_token, refresh_token } = res.data.data;
  setTokens(access_token, refresh_token);
  return access_token;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isNoRefresh = NO_REFRESH.some((p) => original?.url?.includes(p));

    if (error.response?.status !== 401 || !original || original._retry || isNoRefresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
  // Only react once, even if several requests fail at the same moment.
      if (useAuthStore.getState().accessToken) {
        useAuthStore.getState().clear();
        queryClient.clear(); // never leave one user's data in memory for the next login
        toast.error("Your session has expired. Please log in again.", { id: "session-expired" });
      }
      return Promise.reject(refreshError);
    }
  },
);