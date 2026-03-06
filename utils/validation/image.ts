import type { UploadInput } from "~~/server/services/storage.service";

export function validateImageFile(file?: UploadInput | null) {
  if (!file) {
    return false;
  }

  // Check for valid content type
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validImageTypes.includes(file?.contentType || "")) {
    return false;
  }

  // Check file size
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file?.size && file.size > maxSizeInBytes) {
    return false;
  }

  return true;
}
