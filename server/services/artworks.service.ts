import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { MultiPartData } from "h3";
import {
  type ArtworkForm,
  type ExistingArtworkForm,
  GalleryForm,
} from "@utils/validation/form";
import type { ArtworkData } from "#types/artworks/artworks";
import type { UploadInput } from "./storage.service";
import { validateImageFile } from "@utils/validation/image";
import { uploadFile, deleteFile } from "./storage.service";

// To Do:
// add form validation
// dont pass in a form - pass in fields directly
async function addArtwork(
  supabase: SupabaseClient<Database>,
  artwork: ArtworkData,
  image: UploadInput,
) {
  console.log("Adding new artwork"); // reached here - but throwing error

  if (
    !artwork.title ||
    !artwork.description ||
    !artwork.price ||
    !artwork.dimensions ||
    !image
  ) {
    console.log("Missing artwork fields!");

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "No artwork received!",
      },
    });
  }

  // if (
  //   !artwork.title ||
  //   !artwork.description ||
  //   !artwork.price ||
  //   !artwork.image ||
  //   !artwork.dimensions
  // ) {
  //   throw new Error("Missing artwork fields!");
  // }
  // validate image
  // To Do: fix this
  // const image: File | null = artwork.image;

  // should be already validated
  // try {
  //   validateImageFile(image);
  // } catch (e) {
  //   throw createError({
  //     statusCode: 500,
  //     statusMessage: "Internal Error",
  //     data: {
  //       message: "Invalid artwork!",
  //     },
  //   });
  // }

  try {
    const path = await uploadFile(supabase, image, "artwork_images");

    const imageUrl = typeof path === "string" ? path : (path.path ?? "");

    const parsedPrice = Number(artwork.price);

    const { data, error } = await supabase.from("artworks").insert({
      title: artwork.title,
      description: artwork.description,
      price: parsedPrice,
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
  id: string,
  artwork: ArtworkData,
  image: UploadInput,
) {
  if (!id || !artwork || !supabase || !image) {
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
    !artwork.dimensions
  ) {
    throw new Error("Missing artwork fields!");
  }

  // const image: File | null = artwork.image;

  // to do - use artist id to find image path
  // delete old image from storage - using delete file function
  // upload new image
  // to do - check if image actually needs to be updated first

  let parsedPrice: number;
  try {
    parsedPrice = Number(artwork.price);
  } catch (err) {
    console.log("Error parsing price: " + err);
    throw new Error("Invalid price value!");
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("image_path")
    .eq("id", id)
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
    await supabase
      .from("artworks")
      .update({
        title: artwork.title,
        description: artwork.description,
        price: parsedPrice,
        image_path: imagePath.path,
        dimensions: artwork.dimensions,
      })
      .eq("id", id);
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
          .from("gallery_images")
          .getPublicUrl(imagePath);
        // @ts-ignore assign back
        row.image_path = publicData?.publicUrl ?? null;
      }
    });
  }

  return rows;
}

async function deleteGalleryImage(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  // Verify image exists
  const { data: existingImage, error } = await supabase
    .from("gallery_images")
    .select("id, image_path")
    .eq("id", id)
    .single();

  if (
    error ||
    !existingImage ||
    !existingImage.image_path ||
    !existingImage.id
  ) {
    console.log("Error - image doesnt exist");
    throw new Error("Gallery image doesn't exist!");
  }

  const imagePath = existingImage?.image_path;

  try {
    await deleteFile(supabase, imagePath, "gallery_images");
    console.log("File deleted!");
    await supabase.from("gallery_images").delete().eq("id", existingImage.id);
  } catch (err) {
    console.log("Failed to delete file: " + err);
    throw new Error("Failed to delete the image!");
  }
}

// organize better later
type Image = {
  filename: string;
  data: Buffer;
  size: number;
  contentType: string;
};

async function addGalleryImages(
  supabase: SupabaseClient<Database>,
  artworkId: string,
  images: UploadInput[],
) {
  console.log("Adding gallery images...");

  if (!supabase || !artworkId || !images) {
    throw new Error("Missing parameters!");
  }

  // const artworkId = galleryForm.artworkId;
  // const images: File[] | null = galleryForm.images; // To Do: figure out this type error
  console.log("artwork id: " + artworkId);

  if (!artworkId || !images || images.length === 0) {
    throw new Error("Invalid gallery form data!");
  }

  // To Do:
  // 1.) validate artwork ID exists
  const { data: existingArtwork, error: fetchError } = await supabase
    .from("artworks")
    .select("id")
    .eq("id", artworkId)
    .single();

  if (fetchError || !existingArtwork) {
    console.log("Failed to fetch artwork:", fetchError);
    throw new Error("Artwork does not exist!");
  }

  // 2.) upload each image to get the path
  for (const image of images) {
    // RLS error here
    try {
      const imagePath = await uploadFile(
        supabase,
        image, // how to change to file?
        "gallery_images",
      );

      // 3.) insert each gallery image record with path into gallery_images table
      if (!imagePath) {
        throw new Error("Failed to get image path for gallery image!");
      }
      const { error } = await supabase.from("gallery_images").insert({
        artwork_id: artworkId,
        image_path: imagePath.path,
      });

      if (error) {
        throw new Error(
          `Failed to insert gallery image record: ${error.message}`,
        );
      }
    } catch (err) {
      console.log("Failed to upload gallery image:", err);
      throw new Error("Failed to upload gallery image!");
    }
  }
}

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
  addGalleryImages,
  deleteGalleryImage,
};
