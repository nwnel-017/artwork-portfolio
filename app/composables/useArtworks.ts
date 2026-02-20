import type { Database } from "#types/supabase/database";

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"];

export function useArtworks() {
  const getArtworks = () => {
    return useFetch<ArtworkRow[]>("/api/artworks/artworks");
  };

  const addArtwork = async (
    title: string,
    description: string,
    image: File | null,
    dimensions: string,
    price: string,
    collection: string,
  ) => {
    // Validation
    if (
      !title ||
      !description ||
      !image ||
      !price ||
      !dimensions ||
      !collection
    ) {
      return {
        success: false,
        message: "Please enter all fields!",
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("dimensions", dimensions);
    formData.append("image", image);
    formData.append("collection", collection);

    try {
      console.log("Submitting artwork...");
      const response = await fetch("/api/artworks/artwork", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result?.message || "Failed to submit artwork!",
        };
      }

      return {
        success: true,
        message: "Submitted artwork successfully!",
        data: result,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred! Please try again!",
      };
    }
  };

  const addArtworkImages = async (artworkId: string, images: File[]) => {
    // Validation
    if (!artworkId || images.length === 0) {
      return {
        success: false,
        message: "Artwork ID and images are required!",
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("artworkId", artworkId);
    images.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      console.log("Submitting artwork images...");
      const response = await fetch("/api/artworks/gallery/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ok) {
        return {
          success: false,
          message: result?.message || "Something went wrong!",
        };
      }

      return {
        success: true,
        message: result.message || "Successfully submitted photos!",
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while uploading images! Please try again!",
      };
    }
  };

  return { getArtworks, addArtwork, addArtworkImages };
}
