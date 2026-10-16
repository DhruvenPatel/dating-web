import type { QueryClient } from "@tanstack/react-query";
import type { Message } from "@/types/chat";
import { PAGE_LIMIT, chatApi } from "./api";
import { chatKeys } from "./keys";

export interface ChatData {
  pages: Record<number, Message[]>;
  oldestPage: number;
  lastPage: number;
  reload?: boolean; // set after a delete: offsets shifted, so reload from scratch
}

// Pages are oldest-first and there's no total, so find the newest page by
// probing: grow exponentially, then binary-search the boundary.
async function findLastPage(conversationId: string): Promise<{ page: number; items: Message[] }> {
  const first = await chatApi.messagesPage(conversationId, 1);
  if (first.length < PAGE_LIMIT) return { page: 1, items: first };

  let lo = 1; // known full page
  let hi = 2;
  for (;;) {
    const items = await chatApi.messagesPage(conversationId, hi);
    if (items.length === 0) break; // hi is past the end
    if (items.length < PAGE_LIMIT) return { page: hi, items };
    lo = hi;
    hi *= 2;
  }
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    const items = await chatApi.messagesPage(conversationId, mid);
    if (items.length === 0) hi = mid;
    else if (items.length < PAGE_LIMIT) return { page: mid, items };
    else lo = mid;
  }
  return { page: lo, items: await chatApi.messagesPage(conversationId, lo) };
}

export async function loadInitial(conversationId: string): Promise<ChatData> {
  const { page, items } = await findLastPage(conversationId);
  const pages: Record<number, Message[]> = { [page]: items };
  let oldestPage = page;
  // If the newest page is nearly empty, also load the one before for context.
  if (page > 1 && items.length < PAGE_LIMIT) {
    pages[page - 1] = await chatApi.messagesPage(conversationId, page - 1);
    oldestPage = page - 1;
  }
  return { pages, oldestPage, lastPage: page };
}

// The list endpoint omits media fields (see backend note). Keep what we
// already know from sending, so media doesn't vanish on the next poll.
function keepMedia(prev: ChatData, pages: Record<number, Message[]>) {
  const known = new Map<string, Message>();
  Object.values(prev.pages).forEach((items) =>
    items.forEach((m) => m.media_url && known.set(m.id, m)),
  );
  const out: Record<number, Message[]> = {};
  for (const [page, items] of Object.entries(pages)) {
    out[Number(page)] = items.map((m) => {
      const old = known.get(m.id);
      return old && !m.media_url
        ? {
            ...m,
            media_id: old.media_id,
            media_url: old.media_url,
            thumbnail_url: old.thumbnail_url,
            duration: old.duration,
          }
        : m;
    });
  }
  return out;
}

// Polling only re-fetches the newest page (plus the next one if it's full).
export async function refreshTail(conversationId: string, prev: ChatData): Promise<ChatData> {
  const pages = { ...prev.pages };
  let last = prev.lastPage;

  pages[last] = await chatApi.messagesPage(conversationId, last);

  if (pages[last].length === 0 && last > prev.oldestPage) {
    delete pages[last];
    last -= 1;
    pages[last] = await chatApi.messagesPage(conversationId, last);
  }

  while (pages[last].length === PAGE_LIMIT) {
    const next = await chatApi.messagesPage(conversationId, last + 1);
    if (next.length === 0) break;
    last += 1;
    pages[last] = next;
  }

  return { ...prev, pages: keepMedia(prev, pages), lastPage: last };
}

export function flatten(data: ChatData | undefined): Message[] {
  if (!data) return [];
  const seen = new Set<string>();
  const out: Message[] = [];
  Object.keys(data.pages)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((p) =>
      data.pages[p].forEach((m) => {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          out.push(m);
        }
      }),
    );
  return out;
}

// Put a just-sent message into the cache immediately.
export async function appendMessage(qc: QueryClient, conversationId: string, message: Message) {
  const key = chatKeys.messages(conversationId);
  // Cancel an in-flight poll so its older result can't erase this message.
  await qc.cancelQueries({ queryKey: key });
  qc.setQueryData<ChatData>(key, (prev) => {
    if (!prev) return prev;
    if (flatten(prev).some((m) => m.id === message.id)) return prev;
    const pages = { ...prev.pages };
    let last = prev.lastPage;
    if ((pages[last]?.length ?? 0) >= PAGE_LIMIT) {
      last += 1;
      pages[last] = [];
    }
    pages[last] = [...(pages[last] ?? []), message];
    return { ...prev, pages, lastPage: last };
  });
}