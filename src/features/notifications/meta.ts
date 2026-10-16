// import { Bell, MessageCircle, UserCheck, UserPlus, type LucideIcon } from "lucide-react";
// import type { AppNotification } from "@/types/notifications";

// export const NOTIFICATION_ICONS: Record<string, LucideIcon> = {
//   friend_request: UserPlus,
//   friend_request_accepted: UserCheck,
//   new_message: MessageCircle,
// };

// export const iconFor = (type: string): LucideIcon => NOTIFICATION_ICONS[type] ?? Bell;

// // Where clicking a notification should take you.
// export function notificationTarget(n: AppNotification): string | null {
//   switch (n.notification_type) {
//     case "friend_request":
//       return "/friends?tab=requests";
//     case "friend_request_accepted":
//       return n.sender_id ? `/users/${n.sender_id}` : "/friends";
//     case "new_message":
//       return n.sender_id ? `/chat/${n.sender_id}` : "/chat";
//     default:
//       return null;
//   }
// }
import { Bell, Heart, MessageCircle, Sparkles, type LucideIcon } from "lucide-react";
import type { AppNotification } from "@/types/notifications";

export const NOTIFICATION_ICONS: Record<string, LucideIcon> = {
  friend_request: Heart, // someone liked you
  friend_request_accepted: Sparkles, // they liked you back: a match
  new_message: MessageCircle,
};

export const iconFor = (type: string): LucideIcon => NOTIFICATION_ICONS[type] ?? Bell;

// Where clicking a notification should take you.
export function notificationTarget(n: AppNotification): string | null {
  switch (n.notification_type) {
    case "friend_request":
      return "/likes";
    case "friend_request_accepted":
    case "new_message":
      return n.sender_id ? `/chat/${n.sender_id}` : "/matches";
    default:
      return null;
  }
}