import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ErrorScreen } from "@/components/common/ErrorScreen";
import { Splash } from "@/components/common/Splash";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/api";
import { SESSION_KEY } from "@/features/auth/session";
import { useLogout } from "@/features/auth/useLogout";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const location = useLocation();
  const logout = useLogout();

  // Confirms the stored session still works. An expired access token is
  // refreshed automatically by the API client; a dead session clears the
  // store, which redirects to /login below.
  const session = useQuery({
    queryKey: SESSION_KEY,
    queryFn: authApi.me,
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (session.data) setUser(session.data);
  }, [session.data, setUser]);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (session.isLoading) return <Splash />;

  if (session.isError) {
    // 401 means the session is being cleared right now: show the splash, not an error.
    if (getErrorStatus(session.error) === 401) return <Splash />;

    // Server down / offline: don't log the user out, let them retry.
    return (
      <ErrorScreen title="Can't reach VIPXFRIEND" message={getErrorMessage(session.error)}>
        <Button onClick={() => session.refetch()}>Try again</Button>
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </ErrorScreen>
    );
  }

  return <Outlet />;
}