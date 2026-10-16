export const MAX_IMAGE_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

// Mirrors the backend rules so users get instant feedback.
export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) return "Only JPEG, PNG or WebP images are allowed.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}