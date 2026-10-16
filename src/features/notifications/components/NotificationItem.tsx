import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notifications";
import {
  useDeleteNotification,
  useMarkNotificationRead,
  useMarkNotificationUnread,
  useSender,
} from "../hooks";
import { iconFor, notificationTarget } from "../meta";

function describe(n: AppNotification, name: string | null): ReactNode {
  if (!name) return n.message; // fall back to the server's text
  switch (n.notification_type) {
        case "friend_request":
      return (
        <>
          <b>{name}</b> liked you.
        </>
      );
    case "friend_request_accepted":
      return (
        <>
          It's a match with <b>{name}</b>!
        </>
      );
    case "new_message":
      return (
        <>
          <b>{name}</b> sent you a message.
        </>
      );
    default:
      return n.message;
  }
}

export function NotificationItem({ notification: n }: { notification: AppNotification }) {
  const navigate = useNavigate();
  const sender = useSender(n.sender_id);
  const markRead = useMarkNotificationRead();
  const markUnread = useMarkNotificationUnread();
  const remove = useDeleteNotification();

  const Icon = iconFor(n.notification_type);
  const target = notificationTarget(n);

  const open = () => {
    if (!n.is_read) markRead.mutate(n._id);
    if (target) navigate(target);
  };

  return (
    <div className={cn("flex items-start gap-3 p-4 transition", !n.is_read && "bg-primary/5")}>
      <button onClick={open} className="flex min-w-0 flex-1 items-start gap-3 text-left">
        <div className="relative shrink-0">
          <Avatar src={sender.pictureUrl} name={sender.name ?? n.title} size={44} />
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground">
            <Icon size={11} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm">{describe(n, sender.name)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
        </div>
      </button>

      {!n.is_read && (
        <span aria-label="Unread" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      )}

      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => (n.is_read ? markUnread.mutate(n._id) : markRead.mutate(n._id))}
          aria-label={n.is_read ? "Mark as unread" : "Mark as read"}
          title={n.is_read ? "Mark as unread" : "Mark as read"}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {n.is_read ? <Mail size={15} /> : <MailOpen size={15} />}
        </button>
        <button
          onClick={() => remove.mutate(n._id)}
          disabled={remove.isPending}
          aria-label="Delete notification"
          title="Delete"
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-danger disabled:opacity-60"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}