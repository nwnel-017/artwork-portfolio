import { addArtwork } from "@server/services/artworks.service";
import { validateNewArtworkForm } from "@utils/validation/form";
import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";
import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { UploadInput } from "~~/server/services/storage.service";
import type { ArtworkData } from "#types/artworks/artworks";
import { fi } from "zod/locales";

export default defineEventHandler(async (event) => {
  const adminUser = await requireAdmin(event);
  console.log("Adding new artwork via API");
  const form = await readMultipartFormData(event); // MultiPartData[]

  // passed
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data received",
      },
    });
  }

  // To Do: move logic to extractArtwork util function
  const artworkForm: ArtworkData = {
    title: form.find((field) => field.name === "title")?.data?.toString() || "",
    description:
      form.find((field) => field.name === "description")?.data?.toString() ||
      "",
    price: form.find((field) => field.name === "price")?.data?.toString() || "",
    dimensions:
      form.find((field) => field.name === "dimensions")?.data?.toString() || "",
    collection:
      form.find((field) => field.name === "collection")?.data?.toString() || "",
  };

  console.log("collection id found in route: " + artworkForm.collection);

  const imageField = form.find((field) => field.name === "image");

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

  const image: UploadInput = {
    filename: imageField?.filename || "",
    buffer: imageField?.data || Buffer.from([]),
    size: imageField?.data ? imageField.data.length : 0,
    contentType: imageField?.type || "application/octet-stream",
  };

  // To Do:  call image validation with validateImage()

  try {
    const supabase = (await serverSupabaseClient(
      event,
    )) as SupabaseClient<Database>;

    await addArtwork(supabase, artworkForm, image);
  } catch (err) {
    console.log("error adding artwork: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create artwork!",
      data: {
        err,
      },
    });
  }

  return { success: true, message: "Artwork added successfully!" };
});
