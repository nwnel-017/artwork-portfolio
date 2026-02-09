import { validateGalleryImages } from "@utils/validation/form";
import { addGalleryImages } from "@server/services/artworks.service";
import { serverSupabaseClient } from "#supabase/server";
import { UploadInput } from "@server/services/storage.service";
// To Do:
// 1.) require authentication
// 2.) validate form input
// 3.) call uploadGallery() to upload images

export default defineEventHandler(async (event) => {
  console.log("Received request to upload gallery images!");

  // 1.) Require authentication
  const user = await requireAdmin(event);

  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw new Error("No form data provided");
  }

  // change - we shouldnt throw 500 error for validation issues
  try {
    const validated = await validateGalleryImages(formData);

    if (!validated) {
      console.log("Gallery image validation failed");
      throw createError({
        statusCode: 400,
        message: "Invalid gallery image data!",
      });
    }

    const uploadImages: UploadInput[] = validated.images.map((img) => ({
      filename: img.filename,
      buffer: img.data,
      contentType: img.contentType,
    }));

    const supabase = await serverSupabaseClient(event);

    await addGalleryImages(supabase, validated.artworkId, uploadImages);
  } catch (err) {
    console.log("Something went wrong: " + err);
    throw createError({
      statusCode: 500,
      message: "Internal Error",
    });
  }
});
