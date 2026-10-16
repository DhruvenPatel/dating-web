import { Check, CheckCheck, Image as ImageIcon, Loader2, RotateCw, Trash2, Video, X } from "lucide-react";
import { formatTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import type { PendingMessage } from "../hooks";

function MediaPlaceholder({ kind }: { kind: "image" | "video" }) {
  const Icon = kind === "image" ? ImageIcon : Video;
  return (
    <div className="grid h-36 w-full place-items-center rounded-xl bg-black/10 text-center">
      <div>
        <Icon size={28} className="mx-auto opacity-70" />
        <p className="mt-1 text-xs font-medium">{kind === "image" ? "Photo" : "Video"}</p>
        <p className="text-[11px] opacity-70">Preview unavailable</p>
      </div>
    </div>
  );
}

function Body({ message }: { message: Message }) {
  if (message.message_type === "image") {
    return message.media_url ? (
      <a href={message.media_url} target="_blank" rel="noreferrer">
        <img
          src={message.thumbnail_url || message.media_url}
          alt="Photo"
          loading="lazy"
          className="max-h-72 w-full rounded-xl object-cover"
        />
      </a>
    ) : (
      <MediaPlaceholder kind="image" />
    );
  }
  if (message.message_type === "video") {
    return message.media_url ? (
      <video
        controls
        preload="metadata"
        poster={message.thumbnail_url ?? undefined}
        src={message.media_url}
        className="max-h-72 w-full rounded-xl bg-black"
      />
    ) : (
      <MediaPlaceholder kind="video" />
    );
  }
  return <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>;
}

interface MessageBubbleProps {
  message: Message;
  mine: boolean;
  onDelete?: (message: Message) => void;
}

export function MessageBubble({ message, mine, onDelete }: MessageBubbleProps) {
  const isMedia = message.message_type === "image" || message.message_type === "video";

  return (
    <div className={cn("group flex items-end gap-2", mine ? "justify-end" : "justify-start")}>
      {mine && onDelete && (
        <button
          onClick={() => onDelete(message)}
          aria-label="Delete message"
          className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground opacity-100 transition hover:bg-muted hover:text-danger md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}

      <div
        className={cn(
          "max-w-[78%] sm:max-w-[65%]",
          isMedia ? "w-60 p-1" : "px-3.5 py-2",
          mine
            ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
            : "rounded-2xl rounded-bl-md bg-muted",
        )}
      >
        <Body message={message} />
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isMedia && "px-2 pb-1",
            mine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatTime(message.created_at)}
          {mine &&
            (message.is_read ? (
              <CheckCheck size={14} className="text-emerald-300" />
            ) : (
              <Check size={14} />
            ))}
        </div>
      </div>
    </div>
  );
}

interface PendingBubbleProps {
  item: PendingMessage;
  onRetry: (tempId: string) => void;
  onDismiss: (tempId: string) => void;
}

export function PendingBubble({ item, onRetry, onDismiss }: PendingBubbleProps) {
  const failed = item.status === "failed";

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={cn(
          "max-w-[78%] rounded-2xl rounded-br-md bg-primary text-primary-foreground sm:max-w-[65%]",
          item.kind === "text" ? "px-3.5 py-2" : "w-60 p-1",
          failed ? "opacity-80 ring-2 ring-danger" : "opacity-70",
        )}
      >
        {item.kind === "text" && (
          <p className="whitespace-pre-wrap break-words text-sm">{item.content}</p>
        )}

        {item.kind === "image" && item.previewUrl && (
          <img src={item.previewUrl} alt="" className="max-h-72 w-full rounded-xl object-cover" />
        )}

        {item.kind === "video" && item.previewUrl && (
          <video src={item.previewUrl} muted className="max-h-72 w-full rounded-xl bg-black" />
        )}

        {!failed && (
          <div className="mt-1 flex items-center justify-end gap-1.5 px-2 pb-1 text-[10px]">
            <Loader2 size={12} className="animate-spin" />
            {item.kind !== "text" && item.progress > 0 && item.progress < 100
              ? `Uploading ${item.progress}%`
              : "Sending"}
          </div>
        )}
      </div>

      {failed && (
        <div className="flex items-center gap-2 text-xs text-danger">
          <span>{item.error ?? "Failed to send"}</span>
          <button onClick={() => onRetry(item.tempId)} className="flex items-center gap-1 font-semibold hover:underline">
            <RotateCw size={12} /> Retry
          </button>
          <button onClick={() => onDismiss(item.tempId)} aria-label="Dismiss" className="hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}