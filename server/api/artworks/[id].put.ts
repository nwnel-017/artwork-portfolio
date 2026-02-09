import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { updateArtwork } from "@server/services/artworks.service";
import { serverSupabaseClient } from "#supabase/server";
import {
  validateExistingArtworkForm,
  validateNewArtworkForm,
} from "@utils/validation/form";
import type { ArtworkData } from "#types/artworks/artworks";
import type { UploadInput } from "#types/files/files";

export default defineEventHandler(async (event) => {
  console.log("updating artwork!");

  await requireAdmin(event);

  const supabase = await serverSupabaseClient(event);
  const form = await readMultipartFormData(event);
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data provided",
      },
    });
  }

  // get parameters
  const id = form.find((field) => field.name === "id")?.data?.toString();
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const artworkForm: ArtworkData = {
    title: form.find((field) => field.name === "title")?.data?.toString() || "",
    description:
      form.find((field) => field.name === "description")?.data?.toString() ||
      "",
    dimensions:
      form.find((field) => field.name === "dimensions")?.data?.toString() || "",
    price: form.find((field) => field.name === "price")?.data?.toString() || "",
  };

  const imageField = form.find((field) => field.name === "image");

  const image: UploadInput = {
    filename: imageField?.filename || "",
    buffer: imageField?.data || Buffer.from([]),
    size: imageField?.data ? imageField.data.length : 0,
    contentType: imageField?.type || "application/octet-stream",
  };

  // validate artwork
  // const validatedForm = await validateExistingArtworkForm(form); // expects object
  const validatedForm = await validateNewArtworkForm(artworkForm); // expects object
  if (!validatedForm.success) {
    // invalid form
    console.log("Invalid form!");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid form!",
      },
    });
  }

  // To Do: image validation with validateImage()
  // const validatedImage = validateImage(imageField);

  try {
    await updateArtwork(supabase, id, artworkForm, image);
    return { success: true };
  } catch (err) {
    console.log("error updating artwork: " + err);
    throw new Error("Failed to update artist!");
  }
});
