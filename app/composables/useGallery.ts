import type { Database } from "#types/supabase/database";
import { success } from "zod";

export function useGallery() {
  type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];

  const deleteImage = async (id: string) => {
    if (!id) {
      alert("Missing ID");
    }

    const response = await fetch(`/api/artworks/gallery/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, message: "Something went wrong" };
    }

    return { success: true, message: "Successfully removed image" };
  };

  const getGalleryImages = async (id: string): Promise<GalleryRow[]> => {
    console.log("Fetching gallery images");
    return await $fetch<GalleryRow[]>(`/api/artworks/gallery/${id}`);
  };

  return { getGalleryImages, deleteImage };
}
