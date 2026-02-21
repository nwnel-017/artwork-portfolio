import type { Database } from "#types/supabase/database";
import { success } from "zod";

export function useGallery() {
  type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];
  const { startLoading, stopLoading } = useLoading();

  const deleteImage = async (id: string) => {
    if (!id) {
      alert("Missing ID");
    }

    try {
      startLoading();
      await fetch(`/api/artworks/gallery/${id}`, {
        method: "DELETE",
      });
      return { success: true, message: "Image has been deleted" };
    } catch (err) {
      console.log("An error occured: " + err);
      return { success: false, message: "Something went wrong" };
    } finally {
      stopLoading();
    }
  };

  const getGalleryImages = async (id: string): Promise<GalleryRow[]> => {
    console.log("Fetching gallery images");
    return await $fetch<GalleryRow[]>(`/api/artworks/gallery/${id}`);
  };

  return { getGalleryImages, deleteImage };
}
