import { serverSupabaseClient } from "#supabase/server";
import { deleteCollection } from "@server/services/collections.service";

export default defineEventHandler(async (event) => {
  console.log("deleting collection");

  await requireAdmin(event);

  const id = event.context.params?.id as string;

  if (!id) {
    return createError({
      status: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Missing ID",
      },
    });
  }

  try {
    const supabase = await serverSupabaseClient(event);
    await deleteCollection(supabase, id);
    return { success: true, message: "Collection deleted successfully" };
  } catch (err) {
    console.log("Error occured deleting artwork: " + err);
    return createError({
      statusCode: 500,
      message: "Internal Error",
      data: {
        message: err,
      },
    });
  }
});
