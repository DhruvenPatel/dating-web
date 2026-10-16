import { QueryClient } from "@tanstack/react-query";
import { getErrorStatus } from "@/lib/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Never retry client errors (400/401/403/404); retry network/server errors twice.
      retry: (failureCount, error) => {
        const status = getErrorStatus(error);
        if (status && status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});