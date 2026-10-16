import { create } from "zustand";
import { persist } from "zustand/middleware";

// The backend has no "list blocked users" endpoint, so blocks made from this
// browser are remembered locally, separately for each account (ownerId).
export interface BlockedEntry {
  ownerId: string;
  userId: string;
  name: string;
  username: string | null;
  pictureUrl: string | null;
  blockedAt: string;
}

interface BlockedState {
  entries: BlockedEntry[];
  add: (entry: BlockedEntry) => void;
  remove: (ownerId: string, userId: string) => void;
}

export const useBlockedStore = create<BlockedState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((s) => ({
          entries: [
            ...s.entries.filter((e) => !(e.ownerId === entry.ownerId && e.userId === entry.userId)),
            entry,
          ],
        })),
      remove: (ownerId, userId) =>
        set((s) => ({
          entries: s.entries.filter((e) => !(e.ownerId === ownerId && e.userId === userId)),
        })),
    }),
    { name: "vipxfriend-blocked" },
  ),
);