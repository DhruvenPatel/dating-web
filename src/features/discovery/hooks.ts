import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { DiscoveryFilters, DiscoveryPage, DiscoveryUser } from "@/types/discovery";
import { discoveryApi } from "./api";

const nextPage = (last: DiscoveryPage) =>
  last.pagination.has_next ? last.pagination.page + 1 : undefined;

export function useDiscoverUsers(filters: DiscoveryFilters, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["discovery", "users", filters],
    queryFn: ({ pageParam }) => discoveryApi.users(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    placeholderData: keepPreviousData, // old results stay visible while filtering
    enabled,
  });
}

export function useSuggestions(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["discovery", "suggestions"],
    queryFn: ({ pageParam }) => discoveryApi.suggestions(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled,
  });
}

export function usePublicProfile(userId: string, enabled = true) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => discoveryApi.publicProfile(userId),
    enabled: enabled && !!userId,
    retry: false,
  });
}

// Flatten pages and drop duplicates in case data shifts between page loads.
export function flattenPages(pages: DiscoveryPage[] | undefined): DiscoveryUser[] {
  const seen = new Map<string, DiscoveryUser>();
  pages?.forEach((p) => p.data.forEach((u) => seen.set(u.id, u)));
  return [...seen.values()];
}