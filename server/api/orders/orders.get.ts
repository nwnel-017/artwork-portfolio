import { serverSupabaseClient } from "#supabase/server";
import { getOrders } from "@server/services/orders.service";

export default defineEventHandler(async (event) => {
  const adminUser = await requireAdmin(event);

  try {
    const supabase = await serverSupabaseClient(event);
    const data = await getOrders(supabase);
    return data;
  } catch (err) {
    return createError({ statusCode: 500, statusMessage: "Internal Error" });
  }
});
