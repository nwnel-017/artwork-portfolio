import { defineEventHandler, readBody, createError } from "h3";
import { updateOrderStatusById } from "@server/services/orders.service";
import { serverSupabaseClient } from "#supabase/server";
import { validateOrderStatus } from "~~/utils/validation/other";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
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

    const validatedStatus = validateOrderStatus(status);

    if (!validatedStatus.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: {
          message: "Invalid order status!",
        },
      });
    }

    const supabase = await serverSupabaseClient(event);
    await updateOrderStatusById(supabase, orderId, validatedStatus.data);

    return { success: true };
  } catch (err) {
    console.log("Error updating status: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
