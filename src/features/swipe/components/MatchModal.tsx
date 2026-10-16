import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
// import type { DiscoveryUser } from "@/types/discovery";
export interface MatchPerson {
  id: string;
  name: string;
  pictureUrl?: string | null;
}
function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 16 }, (_, id) => ({
      id,
      left: Math.random() * 100,
      size: 14 + Math.random() * 22,
      delay: Math.random() * 1.2,
      duration: 3 + Math.random() * 2,
    })),
  );

  return (
    <>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="pointer-events-none absolute -bottom-10 text-pink-400/80"
          style={{ left: `${h.left}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -900, opacity: [0, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
        >
          <Heart size={h.size} fill="currentColor" />
        </motion.span>
      ))}
    </>
  );
}

interface MatchModalProps {
  them: MatchPerson | null;
  meName: string;
  mePicture?: string | null;
  onClose: () => void;
}

export function MatchModal({ them, meName, mePicture, onClose }: MatchModalProps) {
  useEffect(() => {
    if (!them) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [them, onClose]);

  const theirName = them?.name ?? "";
  return (
    <AnimatePresence>
      {them && (
        <motion.div
          key="match"
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="It's a match"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/85 p-4 backdrop-blur-sm"
        >
          <FloatingHearts />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-sm text-center"
          >
            <h2 className="font-display text-5xl font-extrabold tracking-tight text-brand">
              It's a match!
            </h2>
            <p className="mt-2 text-white/80">You and {theirName} liked each other.</p>

            <div className="mt-8 flex items-center justify-center">
              <Avatar
                src={mePicture}
                name={meName}
                size={112}
                className="-mr-4 ring-4 ring-white/90"
              />
              <span className="z-10 grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-glow">
                <Heart size={22} fill="currentColor" />
              </span>
              <Avatar
                src={them.pictureUrl}
                name={theirName}
                size={112}
                className="-ml-4 ring-4 ring-white/90"
              />
            </div>

            <div className="mt-9 space-y-3">
              <Link
                to={`/chat/${them.id}`}
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                Send message
              </Link>
              <button
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/25 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Keep swiping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}