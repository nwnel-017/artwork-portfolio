import { requireAdmin } from "#imports";
import { serverSupabaseClient } from "#supabase/server";
import { createCollection } from "@server/services/collections.service";

export default defineEventHandler(async (event) => {
  const isAdmin = await requireAdmin(event);

  const body = await readBody(event);
  const { name } = body;

  if (!name) {
    console.log("Missing parameters");
    return createError({
      statusCode: 400,
      data: {
        message: "Bad request",
      },
    });
  }

  // To Do: create the collection
  try {
    const supabase = await serverSupabaseClient(event);
    await createCollection(supabase, name);
    return { success: true, message: "Collection created" };
  } catch (err) {
    console.log("Internal Error: " + err);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Something went wrong",
      },
    });
  }
});
