export function validateImageFile(file: File | File[] | null | undefined) {
  // Normalize arrays (e.g., FormData entries can be File[] or empty arrays)
  if (Array.isArray(file)) {
    file = file[0];
  }

  if (!file) {
    throw new Error("No file provided.");
  }

  // Runtime guard in case a non-File sneaks through
  if (!(file instanceof File)) {
    throw new Error("Invalid file input.");
  }

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (!validImageTypes.includes(file.type)) {
    throw new Error(
      "Invalid image type. Allowed types are JPEG, PNG, GIF, and WEBP."
    );
  }
  if (file.size > maxSizeInBytes) {
    throw new Error("Image size exceeds the maximum limit of 5MB.");
  }
  return true;
}
