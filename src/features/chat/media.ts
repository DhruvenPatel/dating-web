const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;

export const CHAT_ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(",");

export type MediaKind = "image" | "video";

// Mirrors the backend media rules so users get instant feedback.
export function classifyFile(file: File): { kind: MediaKind } | { error: string } {
  if (IMAGE_TYPES.includes(file.type)) {
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      return { error: `Photos must be smaller than ${MAX_IMAGE_MB} MB.` };
    }
    return { kind: "image" };
  }
  if (VIDEO_TYPES.includes(file.type)) {
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return { error: `Videos must be smaller than ${MAX_VIDEO_MB} MB.` };
    }
    return { kind: "video" };
  }
  return { error: "Only JPEG, PNG, WebP photos and MP4, WebM, MOV, MKV videos are allowed." };
}