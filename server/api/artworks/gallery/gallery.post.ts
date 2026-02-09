import { validateGalleryImages } from "@utils/validation/form";
import { addGalleryImages } from "@server/services/artworks.service";
import { serverSupabaseClient } from "#supabase/server";
import { UploadInput } from "@server/services/storage.service";
// To Do:
// 1.) Extract file fields into UploadInput[] object
// 2.) Call validation on UploadInput[] object and verify success
// 3.) Call validateImage on each object in the array
// 4.) Pass UploadInput[] array to service layer

export default defineEventHandler(async (event) => {
  console.log("Received request to upload gallery images!");

  // 1.) Require authentication
  const user = await requireAdmin(event);

  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw new Error("No form data provided");
  }

  // 2.) Exctract image field
  const artworkIdField = formData.find((field) => field.name === "artworkId");
  const artworkId = artworkIdField?.data.toString() || "";
  const imageField = formData.filter((field) => field.name === "image");

  if (!artworkId || !imageField) {
    console.log("Missing artworkId or imageField in form");
    throw createError({
      statusCode: 400,
      data: {
        message: "Internal Error",
      },
    });
  }

  const images: UploadInput[] = [];

  for (let img of imageField) {
    images.push({
      filename: img?.filename || "",
      buffer: img?.data || Buffer.from([]),
      size: img?.data ? img.data.length : 0,
      contentType: img?.type || "application/octet-stream",
    });
  }

  // change - we shouldnt throw 500 error for validation issues
  try {
    // To Do: no artwork validation required - just call validateImage on each item in images[]
    // const validated = await validateGalleryImages(artworkId, images);

    // if (!validated) {
    //   console.log("Gallery image validation failed");
    //   throw createError({
    //     statusCode: 400,
    //     message: "Invalid gallery image data!",
    //   });
    // }

    // const uploadImages: UploadInput[] = validated.images.map((img) => ({
    //   filename: img.filename,
    //   buffer: img.data,
    //   contentType: img.contentType,
    // }));

    const supabase = await serverSupabaseClient(event);

    await addGalleryImages(supabase, artworkId, images);

    return { success: true, message: "Successfully Added Gallery Photos!" };
  } catch (err) {
    console.log("Something went wrong: " + err);
    throw createError({
      statusCode: 500,
      message: "Internal Error",
    });
  }
});
