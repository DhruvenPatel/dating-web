import type { CloudImage } from "./profile";

// Used by requests and mutual friends (these return `id`).
export interface FriendUser {
  id: string;
  username: string | null;
  full_name: string | null;
  display_name: string | null;
  profile_picture: CloudImage | null;
  is_verified: boolean;
  is_online: boolean;
}

// GET /friends returns `friend_id`, not `id`.
export interface Friend {
  friend_id: string;
  username: string | null;
  full_name: string | null;
  display_name: string | null;
  profile_picture: CloudImage | null;
  is_verified: boolean;
  is_online: boolean;
  friends_since: string | null;
}

export interface SentRequest {
  id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  receiver: FriendUser | null;
}

export interface ReceivedRequest {
  id: string;
  sender_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  sender: FriendUser | null;
}