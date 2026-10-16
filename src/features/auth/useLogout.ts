import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "./api";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    const { refreshToken, clear } = useAuthStore.getState();

    try {
      // Revoke the refresh token on the server. Ignore failures: we log out locally anyway.
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }

    clear();
    queryClient.clear(); // never leave one user's cached data for the next login
    navigate("/login", { replace: true });
  };
}