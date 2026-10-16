import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { dayKey, formatDayLabel } from "@/lib/date";
import type { Message } from "@/types/chat";
import type { PendingMessage } from "../hooks";
import { MessageBubble, PendingBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  pending: PendingMessage[];
  myId: string;
  canLoadEarlier: boolean;
  loadingEarlier: boolean;
  onLoadEarlier: () => void;
  onDelete: (message: Message) => void;
  onRetry: (tempId: string) => void;
  onDismiss: (tempId: string) => void;
}

export function MessageList({
  messages,
  pending,
  myId,
  canLoadEarlier,
  loadingEarlier,
  onLoadEarlier,
  onDelete,
  onRetry,
  onDismiss,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const firstRender = useRef(true);
  const heightBeforePrepend = useRef(0);

  const handleScroll = () => {
    const el = containerRef.current;
    if (el) nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  // Keep the viewport steady when older messages are added above.
  const firstId = messages[0]?.id;
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el && heightBeforePrepend.current) {
      el.scrollTop += el.scrollHeight - heightBeforePrepend.current;
      heightBeforePrepend.current = 0;
    }
  }, [firstId]);

  // Stick to the bottom for new messages (and always for your own sends).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (firstRender.current) {
      if (messages.length || pending.length) {
        el.scrollTop = el.scrollHeight;
        firstRender.current = false;
      }
      return;
    }
    if (nearBottom.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, pending.length]);

  useEffect(() => {
    if (pending.length) nearBottom.current = true; // you just sent something
  }, [pending.length]);

  const loadEarlier = () => {
    heightBeforePrepend.current = containerRef.current?.scrollHeight ?? 0;
    onLoadEarlier();
  };

  return (
    // data-lenis-prevent: let this box scroll natively instead of via Lenis
    <div
      ref={containerRef}
      data-lenis-prevent
      onScroll={handleScroll}
      className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4"
    >
      {canLoadEarlier && (
        <div className="grid place-items-center pb-2">
          <button
            onClick={loadEarlier}
            disabled={loadingEarlier}
            className="flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-60"
          >
            {loadingEarlier && <Loader2 size={12} className="animate-spin" />}
            Load earlier messages
          </button>
        </div>
      )}

      {messages.map((m, i) => {
        const showDay = i === 0 || dayKey(messages[i - 1].created_at) !== dayKey(m.created_at);
        return (
          <Fragment key={m.id}>
            {showDay && (
              <div className="grid place-items-center py-2">
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {formatDayLabel(m.created_at)}
                </span>
              </div>
            )}
            <MessageBubble message={m} mine={m.sender_id === myId} onDelete={onDelete} />
          </Fragment>
        );
      })}

      {pending.map((p) => (
        <PendingBubble key={p.tempId} item={p} onRetry={onRetry} onDismiss={onDismiss} />
      ))}
    </div>
  );
}