import { defineEventHandler, readBody, createError } from "h3";
import { updateOrderStatusById } from "@server/services/orders.service";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { orderId, status } = body;

    if (!orderId || !status) {
      console.log("Missing orderId or status");
      throw createError({
        statusCode: 400,
        statusMessage: "orderId and status are required",
      });
    }
    const supabase = await serverSupabaseClient(event);
    // Call your service function to update status
    await updateOrderStatusById(supabase, orderId, status);

    return { success: true };
  } catch (err) {
    console.log("Error updating status: " + err);
    // Basic error forwarding
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
