import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { BadgeCheck, ChevronDown, Heart, MapPin, User } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import type { DiscoveryUser } from "@/types/discovery";

export type SwipeDirection = "left" | "right";

export interface SwipeCardHandle {
  swipe: (direction: SwipeDirection) => void;
  toggleInfo: () => void;
}

interface SwipeCardProps {
  user: DiscoveryUser;
  depth: number; // 0 = top card, 1-2 = cards waiting behind it
  likesYou: boolean;
  onSwiped: (user: DiscoveryUser, direction: SwipeDirection) => void;
}

const THRESHOLD = 110; // px dragged before a release counts as a swipe
const VELOCITY = 500; // px/s: a quick flick also counts

function Chips({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(function SwipeCard(
  { user, depth, likesYou, onSwiped },
  ref,
) {
  const isTop = depth === 0;
  const name = user.display_name || user.full_name;
  const location = [user.city, user.country].filter(Boolean).join(", ");

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [30, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-130, -30], [1, 0]);

  const [expanded, setExpanded] = useState(false);
  const leaving = useRef(false);

  // Fly the card off screen, then tell the deck.
  const fling = useCallback(
    (direction: SwipeDirection) => {
      if (!isTop || leaving.current) return;
      leaving.current = true;
      setExpanded(false);
      const target = (direction === "right" ? 1 : -1) * (window.innerWidth + 240);
      animate(x, target, {
        duration: 0.28,
        ease: "easeIn",
        onComplete: () => onSwiped(user, direction),
      });
    },
    [isTop, onSwiped, user, x],
  );

  useImperativeHandle(ref, () => ({ swipe: fling, toggleInfo: () => setExpanded((e) => !e) }), [
    fling,
  ]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isTop || leaving.current) return;
    const { offset, velocity } = info;
    if (offset.x > THRESHOLD || velocity.x > VELOCITY) fling("right");
    else if (offset.x < -THRESHOLD || velocity.x < -VELOCITY) fling("left");
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 35 });
  };

  return (
    <motion.div
      role="group"
      aria-label={user.age ? `${name}, ${user.age}` : name}
      className={cn(
        "absolute inset-0 select-none overflow-hidden rounded-3xl border bg-card shadow-xl",
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={false}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 1 ? 0.85 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      drag={isTop && !expanded ? "x" : false}
      dragMomentum={false}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      onTap={() => {
        if (isTop && !expanded) setExpanded(true);
      }}
    >
      {/* Photo */}
      {user.profile_picture?.url ? (
        <img
          src={user.profile_picture.url}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-violet-700 via-fuchsia-700 to-pink-600">
          <User size={150} className="text-white/25" />
        </div>
      )}

      {/* Name and details over the photo */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-28 text-white">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-2xl font-bold">
            {name}
            {user.age ? <span className="font-medium">, {user.age}</span> : null}
          </h3>
          {user.is_verified && <BadgeCheck size={20} className="shrink-0 text-sky-300" />}
          {user.is_online && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />}
        </div>
        {location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin size={14} /> {location}
          </p>
        )}
        {user.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.interests.slice(0, 3).map((i) => (
              <span key={i} className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur">
                {i}
              </span>
            ))}
          </div>
        )}
      </div>

      {likesYou && (
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-glow">
          <Heart size={12} fill="currentColor" /> Likes you
        </span>
      )}

      {/* LIKE / NOPE stamps that fade in as you drag */}
      <motion.span
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-12 -rotate-12 rounded-xl border-4 border-like px-3 py-1 text-3xl font-extrabold tracking-widest text-like"
      >
        LIKE
      </motion.span>
      <motion.span
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-5 top-12 rotate-12 rounded-xl border-4 border-nope px-3 py-1 text-3xl font-extrabold tracking-widest text-nope"
      >
        NOPE
      </motion.span>

      {/* Details sheet */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="info"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-x-0 bottom-0 top-20 z-20 flex flex-col rounded-t-3xl border-t bg-card"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <h3 className="truncate font-display text-xl font-bold">
                {name}
                {user.age ? <span className="font-medium">, {user.age}</span> : null}
              </h3>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Close details"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto px-5 pb-5 pt-3">
              {(location || user.gender) && (
                <p className="text-sm text-muted-foreground">
                  {[user.gender ? capitalize(user.gender) : null, location].filter(Boolean).join(" · ")}
                </p>
              )}
              {user.bio ? (
                <p className="whitespace-pre-line text-sm">{user.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No bio yet.</p>
              )}
              <Chips title="Languages" items={user.languages} />
              <Chips title="Interests" items={user.interests} />
              <Chips title="Hobbies" items={user.hobbies} />
              <Link
                to={`/users/${user.id}`}
                className="inline-block text-sm font-semibold text-primary hover:underline"
              >
                View full profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});