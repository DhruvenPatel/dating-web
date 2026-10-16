import { MessageCircle } from "lucide-react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChatThread } from "../components/ChatThread";
import { ConversationList } from "../components/ConversationList";

export function ChatPage() {
  const { friendId } = useParams();
  const [params] = useSearchParams();

  // Friends page links here as /chat?with=<id>
  const withId = params.get("with");
  if (withId) return <Navigate to={`/chat/${withId}`} replace />;

  return (
    <div className="flex h-[calc(100dvh-11.5rem)] overflow-hidden rounded-lg border bg-card md:h-[calc(100dvh-3.5rem)]">
      {/* On phones show either the list or the thread, never both */}
      <aside
        className={cn(
          "w-full shrink-0 flex-col border-r md:flex md:w-80",
          friendId ? "hidden" : "flex",
        )}
      >
        <ConversationList activeId={friendId} />
      </aside>

      <section className={cn("min-w-0 flex-1", friendId ? "block" : "hidden md:block")}>
        {friendId ? (
          <ChatThread key={friendId} friendId={friendId} />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <MessageCircle size={40} className="mx-auto text-muted-foreground" />
              <p className="mt-3 font-medium">Select a friend to start chatting</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your conversations will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}