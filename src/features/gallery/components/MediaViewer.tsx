import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import type { MediaItem } from "@/types/chat";

interface MediaViewerProps {
  items: MediaItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaViewer({ items, index, onIndexChange, onClose, onDelete }: MediaViewerProps) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onIndexChange(index + 1);
    };
    window.addEventListener("keydown", onKey);
    // Lock page scroll while the viewer is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, hasPrev, hasNext, onClose, onIndexChange]);

  if (!item) return null;

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-white/70">
          {index + 1} / {items.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(item)}
            aria-label="Delete"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-danger"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index - 1);
            }}
            aria-label="Previous"
            className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft />
          </button>
        )}

        <div className="flex max-h-full max-w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {item.media_type === "video" ? (
            <video
              key={item.id}
              src={item.media_url}
              poster={item.thumbnail_url ?? undefined}
              controls
              autoPlay
              className="max-h-[80vh] max-w-full rounded-lg bg-black"
            />
          ) : (
            <img
              key={item.id}
              src={item.media_url}
              alt=""
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          )}
        </div>

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index + 1);
            }}
            aria-label="Next"
            className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </motion.div>
  );
}