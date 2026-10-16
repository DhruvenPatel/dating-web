import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api";
import type { DiscoveryFilters, DiscoveryPage, PublicProfile } from "@/types/discovery";

const LIMIT = 20;

function toParams(f: DiscoveryFilters, page: number) {
  const params: Record<string, string | number | boolean> = { page, limit: LIMIT };
  if (f.q.trim()) params.search = f.q.trim();
  if (f.gender) params.gender = f.gender;
  if (f.min_age) params.min_age = Number(f.min_age);
  if (f.max_age) params.max_age = Number(f.max_age);
  if (f.country.trim()) params.country = f.country.trim();
  if (f.state.trim()) params.state = f.state.trim();
  if (f.city.trim()) params.city = f.city.trim();
  if (f.language.trim()) params.language = f.language.trim();
  if (f.interest.trim()) params.interest = f.interest.trim();
  if (f.online_only) params.online_only = true;
  return params;
}

export const discoveryApi = {
  users: async (filters: DiscoveryFilters, page: number): Promise<DiscoveryPage> => {
    const res = await api.get<DiscoveryPage>("/discovery/users", {
      params: toParams(filters, page),
    });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  suggestions: async (page: number): Promise<DiscoveryPage> => {
    const res = await api.get<DiscoveryPage>("/discovery/suggestions", {
      params: { page, limit: LIMIT },
    });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  publicProfile: async (userId: string) =>
    (await api.get<ApiEnvelope<PublicProfile>>(`/users/${userId}`)).data.data,
};