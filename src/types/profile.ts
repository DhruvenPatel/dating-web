export interface CloudImage {
  public_id: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

export interface Profile {
  user_id: string;
  username: string;
  full_name: string;
  is_verified: boolean;
  display_name: string | null;
  bio: string | null;
  date_of_birth: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  languages: string[];
  interests: string[];
  hobbies: string[];
  occupation: string | null;
  profile_picture: CloudImage | null;
  cover_photo: CloudImage | null;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export type PrivacyKey =
  | "profile_visibility"
  | "online_status_visibility"
  | "last_seen_visibility"
  | "friend_request_permission"
  | "message_permission"
  | "voice_call_permission"
  | "video_call_permission"
  | "search_visibility";

export type PrivacySettings = Record<PrivacyKey, string> & { updated_at?: string };

export interface MyProfileData {
  user: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    date_of_birth: string | null;
    is_verified: boolean;
  };
  profile: Profile;
  privacy: PrivacySettings;
}