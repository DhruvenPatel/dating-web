import type { CloudImage, Profile } from "./profile";

export interface DiscoveryUser {
  id: string;
  username: string;
  full_name: string;
  display_name: string | null;
  bio: string | null;
  gender: string | null;
  age: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  languages: string[];
  interests: string[];
  hobbies: string[];
  profile_picture: CloudImage | null;
  is_verified: boolean;
  is_online: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface DiscoveryPage {
  data: DiscoveryUser[];
  pagination: Pagination;
}

// Kept as strings so they map 1:1 to URL params and form inputs.
export interface DiscoveryFilters {
  q: string;
  gender: string;
  min_age: string;
  max_age: string;
  country: string;
  state: string;
  city: string;
  language: string;
  interest: string;
  online_only: boolean;
}

export interface PublicProfile {
  id: string;
  username: string;
  full_name: string;
  is_verified: boolean;
  profile: Profile;
  privacy: { profile_visibility: "public" | "friends" | "private" };
}