import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { updateArtwork } from "@server/services/artworks.service";
import { serverSupabaseClient } from "#supabase/server";
import { validateExistingArtworkForm } from "@utils/validation/form";

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

  const validatedForm = await validateExistingArtworkForm(form); // expects object
  if (!validatedForm.success) {
    // invalid form
    console.log("Invalid form!");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid form!",
        details: validatedForm.error.format(),
      },
    });
  }
  try {
    await updateArtwork(supabase, validatedForm.data);
    return { success: true };
  } catch (err) {
    console.log("error updating artwork: " + err);
    throw new Error("Failed to update artist!");
  }
});
