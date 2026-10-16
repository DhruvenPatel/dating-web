import { useCallback, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatApi } from "@/features/chat/api";
import { classifyFile } from "@/features/chat/media";
import { getErrorMessage } from "@/lib/errors";
import type { MediaItem } from "@/types/chat";
import { galleryApi } from "./api";

export interface GalleryChunk {
  items: MediaItem[];
  total: number;
  lastPage: number;
  nextPage: number | undefined;
}

// The server paginates over ALL media but filters to photos afterwards, so a
// page can be empty while more photos exist. We skip ahead until we find
// photos, and stop once we've collected `total` of them.
export function usePhotos() {
  return useInfiniteQuery({
    queryKey: ["gallery", "photos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<GalleryChunk> => {
      let page = pageParam;
      for (let attempts = 0; ; attempts++) {
        const res = await galleryApi.photos(page);
        if (res.data.length > 0 || res.total === 0 || attempts >= 25) {
          return { items: res.data, total: res.total, lastPage: page, nextPage: undefined };
        }
        page += 1;
      }
    },
    getNextPageParam: (last, all) => {
      const loaded = all.reduce((n, c) => n + c.items.length, 0);
      return last.items.length > 0 && loaded < last.total ? last.lastPage + 1 : undefined;
    },
  });
}

export function useVideos() {
  return useInfiniteQuery({
    queryKey: ["gallery", "videos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<GalleryChunk> => {
      const res = await galleryApi.videos(pageParam);
      return {
        items: res.data,
        total: res.total,
        lastPage: pageParam,
        nextPage: pageParam < res.total_pages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (last) => last.nextPage,
  });
}

export function flattenChunks(chunks: GalleryChunk[] | undefined): MediaItem[] {
  const seen = new Map<string, MediaItem>();
  chunks?.forEach((c) => c.items.forEach((m) => seen.set(m.id, m)));
  return [...seen.values()];
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: "image" | "video" }) =>
      kind === "image" ? galleryApi.deletePhoto(id) : galleryApi.deleteVideo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Deleted.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export interface UploadState {
  current: number;
  total: number;
  progress: number;
}

export function useUploadMedia() {
  const qc = useQueryClient();
  const [state, setState] = useState<UploadState | null>(null);

  const upload = useCallback(
    async (files: File[]) => {
      const valid: { file: File; kind: "image" | "video" }[] = [];
      for (const file of files) {
        const result = classifyFile(file);
        if ("error" in result) toast.error(`${file.name}: ${result.error}`);
        else valid.push({ file, kind: result.kind });
      }
      if (!valid.length) return;

      let uploaded = 0;
      for (let i = 0; i < valid.length; i++) {
        const { file, kind } = valid[i];
        setState({ current: i + 1, total: valid.length, progress: 0 });
        const onProgress = (progress: number) =>
          setState((s) => (s ? { ...s, progress } : s));
        try {
          if (kind === "image") await chatApi.uploadPhoto(file, onProgress);
          else await chatApi.uploadVideo(file, onProgress);
          uploaded++;
        } catch (error) {
          toast.error(`${file.name}: ${getErrorMessage(error)}`);
        }
      }

      setState(null);
      if (uploaded > 0) {
        toast.success(`${uploaded} file${uploaded > 1 ? "s" : ""} uploaded.`);
        qc.invalidateQueries({ queryKey: ["gallery"] });
      }
    },
    [qc],
  );

  return { upload, state };
}