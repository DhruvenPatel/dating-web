import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/authStore";

export interface SwipePrefs {
  gender: string; // "" = everyone
  minAge: string;
  maxAge: string;
}

export const DEFAULT_PREFS: SwipePrefs = { gender: "", minAge: "", maxAge: "" };

// The backend has no "pass" concept, so passes live in this browser,
// kept separately for each account.
interface OwnerData {
  passes: Record<string, number>; // userId -> timestamp
  prefs: SwipePrefs;
}

const EMPTY_OWNER: OwnerData = { passes: {}, prefs: DEFAULT_PREFS };

interface SwipeState {
  byOwner: Record<string, OwnerData>;
  pass: (owner: string, userId: string) => void;
  unpass: (owner: string, userId: string) => void;
  clearPasses: (owner: string) => void;
  setPrefs: (owner: string, prefs: SwipePrefs) => void;
}

const read = (s: SwipeState, owner: string): OwnerData => s.byOwner[owner] ?? EMPTY_OWNER;

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set) => ({
      byOwner: {},

      pass: (owner, userId) =>
        set((s) => {
          const current = read(s, owner);
          return {
            byOwner: {
              ...s.byOwner,
              [owner]: { ...current, passes: { ...current.passes, [userId]: Date.now() } },
            },
          };
        }),

      unpass: (owner, userId) =>
        set((s) => {
          const current = read(s, owner);
          const passes = { ...current.passes };
          delete passes[userId];
          return { byOwner: { ...s.byOwner, [owner]: { ...current, passes } } };
        }),

      clearPasses: (owner) =>
        set((s) => ({
          byOwner: { ...s.byOwner, [owner]: { ...read(s, owner), passes: {} } },
        })),

      setPrefs: (owner, prefs) =>
        set((s) => ({
          byOwner: { ...s.byOwner, [owner]: { ...read(s, owner), prefs } },
        })),
    }),
    { name: "vipxfriend-swipe" },
  ),
);

export function useSwipeData() {
  const owner = useAuthStore((s) => s.user?.id) ?? "";
  const data = useSwipeStore((s) => s.byOwner[owner]) ?? EMPTY_OWNER;
  const pass = useSwipeStore((s) => s.pass);
  const unpass = useSwipeStore((s) => s.unpass);
  const clearPasses = useSwipeStore((s) => s.clearPasses);
  const setPrefs = useSwipeStore((s) => s.setPrefs);

  return {
    passes: data.passes,
    prefs: data.prefs,
    passCount: Object.keys(data.passes).length,
    pass: (userId: string) => pass(owner, userId),
    unpass: (userId: string) => unpass(owner, userId),
    clearPasses: () => clearPasses(owner),
    setPrefs: (prefs: SwipePrefs) => setPrefs(owner, prefs),
  };
}