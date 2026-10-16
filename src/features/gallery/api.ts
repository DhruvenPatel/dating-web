import { api } from "@/lib/api";
import type { MediaItem } from "@/types/chat";

export const GALLERY_PAGE_SIZE = 24;

export interface MediaPage {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: MediaItem[];
}

// List endpoints spread pagination at the top level (no {success, data} wrapper around it).
export const galleryApi = {
  photos: async (page: number) =>
    (
      await api.get<MediaPage>("/media/photos", {
        params: { page, limit: GALLERY_PAGE_SIZE },
      })
    ).data,

  videos: async (page: number) =>
    (
      await api.get<MediaPage>("/media/videos", {
        params: { page, limit: GALLERY_PAGE_SIZE },
      })
    ).data,

  deletePhoto: async (id: string) => {
    await api.delete(`/media/photos/${id}`);
  },

  deleteVideo: async (id: string) => {
    await api.delete(`/media/videos/${id}`);
  },
};