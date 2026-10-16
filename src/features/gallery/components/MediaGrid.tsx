import { Loader2, Play } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import type { MediaItem } from "@/types/chat";

function formatDuration(seconds?: number | null): string | null {
  if (!seconds && seconds !== 0) return null;
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface MediaGridProps {
  items: MediaItem[];
  hasNext: boolean;
  isFetchingNext: boolean;
  fetchNext: () => void;
  onOpen: (index: number) => void;
}

export function MediaGrid({ items, hasNext, isFetchingNext, fetchNext, onOpen }: MediaGridProps) {
  const sentinel = useInView(fetchNext, hasNext && !isFetchingNext);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => {
          const isVideo = item.media_type === "video";
          const thumb = item.thumbnail_url || (isVideo ? undefined : item.media_url);
          const duration = isVideo ? formatDuration(item.duration) : null;

          return (
            <button
              key={item.id}
              onClick={() => onOpen(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-muted" />
              )}

              {isVideo && (
                <>
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </span>
                  {duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      {duration}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      <div ref={sentinel} className="grid h-14 place-items-center">
        {isFetchingNext && <Loader2 className="animate-spin text-muted-foreground" />}
      </div>
    </>
  );
}