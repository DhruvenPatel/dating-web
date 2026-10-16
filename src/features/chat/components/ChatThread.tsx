import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircleOff } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFriends } from "@/features/friends/hooks";
import { personName } from "@/features/friends/utils";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import type { Message } from "@/types/chat";
import {
  useChatSend,
  useDeleteMessage,
  useEnsureConversation,
  useMarkRead,
  useMessages,
} from "../hooks";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";

export function ChatThread({ friendId }: { friendId: string }) {
  const myId = useAuthStore((s) => s.user?.id) ?? "";
  const friends = useFriends();
  const friend = friends.data?.find((f) => f.friend_id === friendId);

  const ensure = useEnsureConversation(friendId);
  const conversationId = ensure.data?.id;

  const chat = useMessages(conversationId);
  const send = useChatSend(conversationId);
  const markRead = useMarkRead(conversationId, myId);
  const deleteMessage = useDeleteMessage(conversationId);
  const [toDelete, setToDelete] = useState<Message | null>(null);

  // Tell the server we've read incoming messages (drives read receipts + badges).
  const unreadIncoming = chat.messages.filter((m) => m.sender_id !== myId && !m.is_read).length;
  useEffect(() => {
    if (conversationId && unreadIncoming > 0 && !markRead.isPending) markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, unreadIncoming]);

  const name = friend ? personName(friend) : "Chat";

  const header = (
    <header className="flex items-center gap-3 border-b px-4 py-3">
      <Link
        to="/chat"
        aria-label="Back to messages"
        className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
      >
        <ArrowLeft size={18} />
      </Link>
      {friend ? (
        <Link to={`/users/${friendId}`} className="flex min-w-0 items-center gap-3">
          <Avatar src={friend.profile_picture?.url} name={name} size={40} />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{name}</p>
            {friend.username && (
              <p className="truncate text-xs text-muted-foreground">@{friend.username}</p>
            )}
          </div>
        </Link>
      ) : (
        <Skeleton className="h-10 w-40" />
      )}
    </header>
  );

  // Not a friend (or friends list still loading)
  if (!friends.isLoading && !friend) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="grid flex-1 place-items-center p-6">
          <EmptyState
            icon={<MessageCircleOff size={32} />}
            title="You can only chat with your matches"
            hint="This person isn't one of your matches."
            action={
              <Link to="/chat" className="text-sm font-semibold text-primary hover:underline">
                Back to messages
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {header}

      {ensure.isError ? (
        <div className="grid flex-1 place-items-center p-6">
          <ErrorState message={getErrorMessage(ensure.error)} onRetry={() => ensure.refetch()} />
        </div>
      ) : ensure.isLoading || chat.isLoading ? (
        <div className="flex-1 space-y-3 p-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="ml-auto h-10 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      ) : chat.isError ? (
        <div className="grid flex-1 place-items-center p-6">
          <ErrorState message={getErrorMessage(chat.error)} onRetry={() => chat.refetch()} />
        </div>
      ) : chat.messages.length === 0 && send.pending.length === 0 ? (
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div>
            <p className="font-medium">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Say hello to {name}.</p>
          </div>
        </div>
      ) : (
        <MessageList
          messages={chat.messages}
          pending={send.pending}
          myId={myId}
          canLoadEarlier={chat.canLoadEarlier}
          loadingEarlier={chat.loadingEarlier}
          onLoadEarlier={chat.loadEarlier}
          onDelete={setToDelete}
          onRetry={send.retry}
          onDismiss={send.dismiss}
        />
      )}

      <Composer
        disabled={!conversationId || ensure.isError}
        onSendText={send.sendText}
        onSendFile={send.sendFile}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this message?"
        description="It will be removed for both of you. This can't be undone."
        confirmLabel="Delete"
        loading={deleteMessage.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() =>
          toDelete && deleteMessage.mutate(toDelete.id, { onSettled: () => setToDelete(null) })
        }
      />
    </div>
  );
}