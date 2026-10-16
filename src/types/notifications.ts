// Named AppNotification to avoid clashing with the browser's Notification.
export interface AppNotification {
  _id: string; // raw database id: the backend returns _id, not id
  user_id: string;
  notification_type: "friend_request" | "friend_request_accepted" | "new_message" | string;
  title: string;
  message: string;
  sender_id: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsPage {
  notifications: AppNotification[];
  total: number;
  total_notifications: number;
  unread_count: number;
  skip: number;
  limit: number;
  unread_only: boolean;
  has_more: boolean;
  next_skip: number | null;
}

export interface NotificationPreferences {
  friend_request: boolean;
  friend_request_accepted: boolean;
  new_message: boolean;
}