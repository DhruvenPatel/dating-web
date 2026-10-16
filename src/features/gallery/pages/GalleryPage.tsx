import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, Upload, VideoOff } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { CHAT_ACCEPT } from "@/features/chat/media";
import { getErrorMessage } from "@/lib/errors";
import type { MediaItem } from "@/types/chat";
import { MediaGrid } from "../components/MediaGrid";
import { MediaViewer } from "../components/MediaViewer";
import { flattenChunks, useDeleteMedia, usePhotos, useUploadMedia, useVideos } from "../hooks";

type Tab = "photos" | "videos";

export function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "videos" ? "videos" : "photos";

  const photos = usePhotos();
  const videos = useVideos();
  const active = tab === "photos" ? photos : videos;

  const items = useMemo(() => flattenChunks(active.data?.pages), [active.data]);

  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, state: uploading } = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const [viewing, setViewing] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<MediaItem | null>(null);

  const tabs: { value: Tab; label: string }[] = [
    {
      value: "photos",
      label: `Photos${photos.data ? ` (${photos.data.pages[0].total})` : ""}`,
    },
    {
      value: "videos",
      label: `Videos${videos.data ? ` (${videos.data.pages[0].total})` : ""}`,
    },
  ];

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteMedia.mutate(
      { id: toDelete.id, kind: toDelete.media_type === "video" ? "video" : "image" },
      {
        onSettled: () => setToDelete(null),
        onSuccess: () => {
          // Keep the viewer sensible after a deletion.
          if (items.length <= 1) setViewing(null);
          else setViewing((v) => (v === null ? null : Math.max(0, Math.min(v, items.length - 2))));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Your photos and videos, including ones sent in chat.
          </p>
        </div>

        <Button onClick={() => fileRef.current?.click()} disabled={!!uploading}>
          <Upload size={16} /> Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept={CHAT_ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void upload(files);
          }}
        />
      </div>

      {uploading && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Uploading {uploading.current} of {uploading.total}
            </span>
            <span className="text-muted-foreground">{uploading.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${uploading.progress}%` }}
            />
          </div>
        </div>
      )}

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => setParams(t === "photos" ? {} : { tab: t }, { replace: true })}
      />

      {active.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : active.isError ? (
        <ErrorState message={getErrorMessage(active.error)} onRetry={() => active.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={tab === "photos" ? <ImageOff size={32} /> : <VideoOff size={32} />}
          title={tab === "photos" ? "No photos yet" : "No videos yet"}
          hint="Upload files here, or send them in a chat and they'll appear automatically."
          action={
            <Button size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Upload
            </Button>
          }
        />
      ) : (
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <MediaGrid
            items={items}
            hasNext={!!active.hasNextPage}
            isFetchingNext={active.isFetchingNextPage}
            fetchNext={() => active.fetchNextPage()}
            onOpen={setViewing}
          />
        </motion.div>
      )}

      {viewing !== null && items[viewing] && (
        <MediaViewer
          items={items}
          index={viewing}
          onIndexChange={setViewing}
          onClose={() => setViewing(null)}
          onDelete={setToDelete}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title={toDelete?.media_type === "video" ? "Delete this video?" : "Delete this photo?"}
        description="It will be removed permanently. If you shared it in a chat, it may stop loading there."
        confirmLabel="Delete"
        loading={deleteMedia.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}