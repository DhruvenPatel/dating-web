export interface Conversation {
  id: string;
  participant_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: string; // "text" | "image" | "video"
  content: string | null;
  // Not returned by the message LIST endpoint (see backend note), but present
  // on the response of sending a message.
  media_id?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  duration?: number | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface MediaItem {
  id: string;
  owner_id: string;
  media_type: string;
  file_name?: string | null;
  mime_type: string;
  file_size: number;
  media_url: string;
  thumbnail_url?: string | null;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  created_at: string;
}