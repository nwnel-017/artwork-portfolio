import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { MultiPartData } from "h3";
import {
  type ArtworkForm,
  type ExistingArtworkForm,
} from "@utils/validation/form";
import { validateImageFile } from "@utils/validation/image";
import { uploadFile, deleteFile } from "./storage.service";

// To Do:
// add form validation
async function addArtwork(
  supabase: SupabaseClient<Database>,
  artwork: ArtworkForm,
) {
  console.log("Adding new artwork");

  if (!artwork) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "No artwork received!",
      },
    });
  }

  if (
    !artwork.title ||
    !artwork.description ||
    !artwork.price ||
    !artwork.image ||
    !artwork.dimensions
  ) {
    throw new Error("Missing artwork fields!");
  }
  // validate image
  const image: File | null = artwork.image;

  try {
    validateImageFile(image);
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Invalid artwork!",
      },
    });
  }

  try {
    const path = await uploadFile(supabase, image, "artwork_images");

    const imageUrl = typeof path === "string" ? path : (path.path ?? "");

    const { data, error } = await supabase.from("artworks").insert({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
      dimensions: artwork.dimensions,
      image_path: imageUrl,
    });

    if (error) {
      console.error("Error inserting artwork into database:", error); // error is null?
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Error",
        data: {
          message: "Failed to add artwork to database!",
          details: error?.message || "Unknown error",
        },
      });
    }
    return data;
  } catch (err) {
    console.log("Error: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to upload artwork!",
      },
    });
  }
}

async function updateArtwork(
  supabase: SupabaseClient<Database>,
  artwork: ExistingArtworkForm, // doesnt contain id - we need a new type ExistingArtworkForm
) {
  if (!artwork) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "No artwork received!",
      },
    });
  }

  if (
    !artwork.title ||
    !artwork.description ||
    !artwork.price ||
    !artwork.dimensions ||
    !artwork.image
    // ||
    // !artwork.publishDate
  ) {
    throw new Error("Missing artwork fields!");
  }

  const image: File | null = artwork.image;

  // to do - use artist id to find image path
  // delete old image from storage - using delete file function
  // upload new image
  // to do - check if image actually needs to be updated first
  const { data, error } = await supabase
    .from("artworks")
    .select("image_path")
    .eq("id", artwork.id)
    .single();
  if (error || !data) {
    console.error("Error fetching existing artist data:", error);
    throw new Error("Failed to fetch existing artist data");
  }
  const existingImagePath = data.image_path;
  if (!existingImagePath) {
    throw new Error("No existing image path found for artist");
  }

  try {
    await deleteFile(supabase, existingImagePath, "artwork_images");
    const imagePath = await uploadFile(supabase, image, "artwork_images");
    console.log("image uploaded with public url:", imagePath.publicUrl);
    // console.log("new published date: " + artwork.publishDate); // why is this the same date?
    await supabase
      .from("artworks")
      .update({
        title: artwork.title,
        description: artwork.description,
        price: artwork.price,
        image_path: imagePath.path,
        dimensions: artwork.dimensions,
        // publish_on: artwork.publishDate,
      })
      .eq("id", artwork.id);
  } catch (err) {
    console.log("failed to update artist:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to update artist",
      },
    });
  }
}

async function deleteArtwork(supabase: SupabaseClient<Database>, id: string) {
  console.log("deleting artwork...");

  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  // look up artist for image_path
  const { data: artwork, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  console.log("row retrieved: " + artwork);
  console.log("image path: " + artwork?.image_path); // undefined

  if (error || !artwork || !artwork.image_path) {
    throw new Error("Failed to retrieve artwork!");
  }

  try {
    await deleteFile(supabase, artwork.image_path, "artwork_images");
  } catch (err) {
    console.log("Failed to delete artist: " + err);
    throw new Error("Failed to delete artist");
  }

  // delete artist from artists table
  const { error: deleteError } = await supabase
    .from("artworks")
    .delete()
    .eq("id", id);
  if (deleteError) {
    console.log("failed to delete artwork: " + deleteError);
    throw new Error("Failed to delete artwork!");
  }
}

async function getArtworkDetails(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  console.log("getting artwork details!");

  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log("failed to retrieve artwork details: " + JSON.stringify(error));
    throw new Error("Failed to retrieve artwork from supabase!");
  }

  const imagePath = data?.image_path;

  const { data: publicData } = await supabase.storage
    .from("artwork_images")
    .getPublicUrl(imagePath || "");

  const publicUrl = publicData?.publicUrl || null;

  return { ...data, image_path: publicUrl };
}

async function getArtworkPrice(supabase: SupabaseClient<Database>, id: string) {
  console.log("getting artwork price!");

  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("price")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log("failed to retrieve artwork price: " + error?.message);
    throw new Error("Failed to retrieve artwork price!");
  }

  const price = data?.price;

  if (!price) {
    throw new Error("Artwork price is null or undefined!");
  }

  const amount = Math.round(Number(price) * 100); // Convert to cents

  return amount;
}

async function getArtworkCount(supabase: SupabaseClient<Database>) {
  const { count: artworkCount, error: artError } = await supabase
    .from("artworks")
    .select("id", { count: "exact", head: true });

  if (artError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total artwork count",
        details: artError.message,
      },
    });
  }

  return artworkCount || 0;
}

async function getSoldArtworkCount(supabase: SupabaseClient<Database>) {
  const { count: artworkCount, error: artError } = await supabase
    .from("artworks")
    .select("id", { count: "exact", head: true })
    .eq("sold", true);

  if (artError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total artwork count",
        details: artError.message,
      },
    });
  }

  return artworkCount || 0;
}

async function getArtworks(supabase: SupabaseClient<Database>) {
  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !artworks) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artworks",
        details: error?.message,
      },
    });
  }

  artworks.map((artwork) => {
    const imagePath = artwork.image_path;
    if (imagePath) {
      const { data: publicData } = supabase.storage
        .from("artwork_images")
        .getPublicUrl(imagePath);
      artwork.image_path = publicData?.publicUrl;
    }
  });

  return artworks;
}

async function getLatestArtwork(supabase: SupabaseClient<Database>) {
  if (!supabase) {
    throw new Error("Missing supabase client!");
  }

  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("sold", false)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !artworks || artworks.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch latest artwork",
        details: error?.message,
      },
    });
  }

  const artwork = artworks[0];

  // Get public URL for the image
  if (artwork.image_path) {
    const { data: publicData } = supabase.storage
      .from("artwork_images")
      .getPublicUrl(artwork.image_path);
    artwork.image_path = publicData?.publicUrl;

    if (!publicData) {
      console.log("Error fetching public URL: ");
      throw new Error("Failed to fetch public URL for artwork image!");
    }
  }

  return artwork;
}

async function markArtworkAsSold(
  supabase: SupabaseClient<Database>,
  artworkId: string,
) {
  if (!supabase || !artworkId) {
    throw new Error("Missing parameters!");
  }

  const { error } = await supabase
    .from("artworks")
    .update({ sold: true, updated_at: new Date().toISOString() })
    .eq("id", artworkId);

  if (error) {
    throw new Error(
      `Failed to mark artwork ${artworkId} as sold: ${error.message}`,
    );
  }
}

async function getGalleryImages(
  supabase: SupabaseClient<Database>,
  artworkId: string,
) {
  if (!supabase || !artworkId) {
    throw new Error("Missing parameters!");
  }

  const { data: rows, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("artwork_id", artworkId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch gallery images:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch gallery images",
        details: error.message,
      },
    });
  }

  // Map image_path to public URLs
  if (rows && Array.isArray(rows)) {
    rows.map((row) => {
      const imagePath = row.image_path;
      if (imagePath) {
        const { data: publicData } = supabase.storage
          .from("artwork_images")
          .getPublicUrl(imagePath);
        // @ts-ignore assign back
        row.image_path = publicData?.publicUrl ?? null;
      }
    });
  }

  return rows;
}

// async function getCurrentArtworks(supabase: SupabaseClient<Database>) {
//   const { data: artworks, error } = await supabase
//     .from("artworks")
//     .select("*")
//     .lte("publish_on", new Date().toISOString().slice(0, 10));

//   if (error || !artworks) {
//     throw createError({
//       statusCode: 500,
//       statusMessage: "Internal Error",
//       data: {
//         message: "Failed to fetch artworks",
//         details: error?.message,
//       },
//     });
//   }

//   artworks.map((artwork) => {
//     const imagePath = artwork.image_path;
//     if (imagePath) {
//       const { data: publicData } = supabase.storage
//         .from("artwork_images")
//         .getPublicUrl(imagePath);
//       artwork.image_path = publicData?.publicUrl;
//     }
//   });

//   return artworks;
// }

// async function getUpcomingArtworks(supabase: SupabaseClient<Database>) {
//   if (!supabase) throw new Error("Missing supabase client!");
//   const { data: artworks, error } = await supabase
//     .from("artworks")
//     .select("*")
//     .gt("publish_on", new Date().toISOString().slice(0, 10));

//   if (error || !artworks) {
//     console.log(
//       "error retrieving upcoming gallery from supabase: " + error?.message
//     );
//     throw new Error("Failed to retrieve upcoming gallery!");
//   }

//   artworks.map((artwork) => {
//     const imagePath = artwork.image_path;
//     if (imagePath) {
//       const { data: publicData } = supabase.storage
//         .from("artwork_images")
//         .getPublicUrl(imagePath);
//       artwork.image_path = publicData?.publicUrl;
//     }
//   });

//   return artworks;
// }

export {
  addArtwork,
  getArtworkDetails,
  updateArtwork,
  deleteArtwork,
  getArtworkCount,
  getSoldArtworkCount,
  getArtworks,
  markArtworkAsSold,
  getArtworkPrice,
  getLatestArtwork,
  getGalleryImages,
};
