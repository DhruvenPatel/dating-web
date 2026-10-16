import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flame, Heart, Info, Loader2, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EMPTY_FILTERS } from "@/features/discovery/filters";
import { flattenPages, useDiscoverUsers } from "@/features/discovery/hooks";
import { useMyBlocked, useRelationships } from "@/features/friends/hooks";
import { useMyProfile } from "@/features/profile/hooks";
import { getErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import type { DiscoveryFilters, DiscoveryUser } from "@/types/discovery";
import { useSwipeActions } from "../actions";
import { describePrefs } from "../prefs";
import { useSwipeData } from "../store";
import { MatchModal } from "./MatchModal";
import { SwipeCard, type SwipeCardHandle, type SwipeDirection } from "./SwipeCard";
import { SwipePreferences } from "./SwipePreferences";

interface LastAction {
  user: DiscoveryUser;
  action: "like" | "pass" | "match";
  pending?: Promise<unknown>; // the like request still in flight
}

const DECK_HEIGHT =
  "h-[clamp(22rem,calc(100dvh_-_22rem),40rem)] md:h-[clamp(28rem,calc(100dvh_-_17rem),42rem)]";

export function SwipeDeck() {
  const { passes, prefs, passCount, pass, unpass, clearPasses, setPrefs } = useSwipeData();
  const relations = useRelationships();
  const blocked = useMyBlocked();
  const actions = useSwipeActions();
  const { data: me } = useMyProfile();

  const filters = useMemo<DiscoveryFilters>(
    () => ({ ...EMPTY_FILTERS, gender: prefs.gender, min_age: prefs.minAge, max_age: prefs.maxAge }),
    [prefs],
  );
  const query = useDiscoverUsers(filters, true);

  const [swiped, setSwiped] = useState<Set<string>>(() => new Set());
  const [last, setLast] = useState<LastAction | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [match, setMatch] = useState<DiscoveryUser | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const topRef = useRef<SwipeCardHandle>(null);
  const closeMatch = useCallback(() => setMatch(null), []);

  const lastRef = useRef(last);
  lastRef.current = last;

  /* ---------- Who is in the deck ---------- */
  const all = useMemo(() => flattenPages(query.data?.pages), [query.data]);
  const blockedIds = useMemo(() => new Set(blocked.map((b) => b.userId)), [blocked]);

  const candidates = all.filter((u) => {
    if (passes[u.id] || swiped.has(u.id) || blockedIds.has(u.id)) return false;
    const status = relations.get(u.id).status;
    // Skip friends and people you've already liked; keep people who liked you.
    return status === "none" || status === "pending_received";
  });
  const stack = candidates.slice(0, 3);

  // Keep a few cards in reserve: load the next page when the deck runs low.
  useEffect(() => {
    if (relations.isLoading) return;
    if (query.hasNextPage && !query.isFetchingNextPage && candidates.length < 4) {
      void query.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.length, query.hasNextPage, query.isFetchingNextPage, relations.isLoading]);

  /* ---------- Swiping ---------- */
  const handleSwiped = (user: DiscoveryUser, direction: SwipeDirection) => {
    setSwiped((prev) => new Set(prev).add(user.id));

    if (direction === "left") {
      pass(user.id);
      setLast({ user, action: "pass" });
      return;
    }

    const promise = actions.like(user, relations.get(user.id));
    setLast({ user, action: "like", pending: promise });

    promise
      .then((result) => {
        if (result === "match") {
          setMatch(user);
          setLast({ user, action: "match" });
        }
      })
      .catch((error) => {
        // The like didn't go through: put the card back.
        setSwiped((prev) => {
          const next = new Set(prev);
          next.delete(user.id);
          return next;
        });
        setLast(null);
        toast.error(getErrorMessage(error));
      });
  };

  const undo = async () => {
    const current = lastRef.current;
    if (!current || current.action === "match" || undoing) return;
    setUndoing(true);
    try {
      if (current.action === "like") {
        await current.pending?.catch(() => undefined); // let the request finish first
        if (lastRef.current?.action === "match") {
          toast.info("It turned into a match, so it can't be undone.");
          return;
        }
        await actions.undoLike(current.user);
      } else {
        unpass(current.user.id);
      }
      setSwiped((prev) => {
        const next = new Set(prev);
        next.delete(current.user.id);
        return next;
      });
      setLast(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUndoing(false);
    }
  };

  /* ---------- Keyboard ---------- */
  const undoRef = useRef(undo);
  undoRef.current = undo;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (match || prefsOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        topRef.current?.swipe("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        topRef.current?.swipe("left");
      } else if (e.key === "z" || e.key === "Z") {
        void undoRef.current();
      } else if (e.key === "i" || e.key === "I") {
        topRef.current?.toggleInfo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [match, prefsOpen]);

  /* ---------- Render ---------- */
  const loadingMore =
    query.isFetchingNextPage || (candidates.length === 0 && !!query.hasNextPage);
  const canUndo = !!last && last.action !== "match" && !undoing;

  if (relations.isLoading || query.isLoading) {
    return (
      <div className="mx-auto w-full max-w-sm">
        <Skeleton className={cn("rounded-3xl", DECK_HEIGHT)} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <ErrorState message={getErrorMessage(query.error)} onRetry={() => void query.refetch()} />
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{describePrefs(prefs)}</p>
        <button
          onClick={() => setPrefsOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <SlidersHorizontal size={14} /> Preferences
        </button>
      </div>

      <div className={cn("relative", DECK_HEIGHT)}>
        {stack.length > 0 ? (
          stack.map((user, depth) => (
            <SwipeCard
              key={user.id}
              ref={depth === 0 ? topRef : undefined}
              user={user}
              depth={depth}
              likesYou={relations.get(user.id).status === "pending_received"}
              onSwiped={handleSwiped}
            />
          ))
        ) : loadingMore ? (
          <div className="grid h-full place-items-center rounded-3xl border bg-card">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid h-full place-items-center rounded-3xl border border-dashed bg-card p-4">
            <EmptyState
              icon={<Flame size={36} />}
              title="You've seen everyone for now"
              hint="Check back later, widen your preferences, or bring back people you passed."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button size="sm" onClick={() => setPrefsOpen(true)}>
                    Edit preferences
                  </Button>
                  {passCount > 0 && (
                    <Button size="sm" variant="outline" onClick={clearPasses}>
                      Show passed again ({passCount})
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    loading={query.isRefetching}
                    onClick={() => void query.refetch()}
                  >
                    Refresh
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </div>

      {stack.length > 0 && (
        <>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => void undo()}
              disabled={!canUndo}
              aria-label="Undo last swipe"
              title="Undo (Z)"
              className="grid h-12 w-12 place-items-center rounded-full border bg-card text-amber-400 transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => topRef.current?.swipe("left")}
              aria-label="Pass"
              title="Pass (←)"
              className="grid h-16 w-16 place-items-center rounded-full border-2 border-nope bg-card text-nope shadow-lg transition hover:scale-105 active:scale-95"
            >
              <X size={30} strokeWidth={3} />
            </button>
            <button
              onClick={() => topRef.current?.swipe("right")}
              aria-label="Like"
              title="Like (→)"
              className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-glow transition hover:scale-105 active:scale-95"
            >
              <Heart size={30} fill="currentColor" />
            </button>
            <button
              onClick={() => topRef.current?.toggleInfo()}
              aria-label="Show details"
              title="Details (I)"
              className="grid h-12 w-12 place-items-center rounded-full border bg-card text-primary transition hover:scale-105"
            >
              <Info size={20} />
            </button>
          </div>
          <p className="mt-4 hidden text-center text-xs text-muted-foreground md:block">
            Tip: ← pass · → like · Z undo · I details
          </p>
        </>
      )}

      {prefsOpen && (
        <SwipePreferences
          prefs={prefs}
          onSave={setPrefs}
          onClose={() => setPrefsOpen(false)}
        />
      )}

      <MatchModal
        them={
            match
                ? {
                    id: match.id,
                    name: match.display_name || match.full_name,
                    pictureUrl: match.profile_picture?.url,
                }
            : null
        }
        meName={me?.profile.display_name || me?.user.full_name || "You"}
        mePicture={me?.profile.profile_picture?.url}
        onClose={closeMatch}
      />
    </div>
  );
}