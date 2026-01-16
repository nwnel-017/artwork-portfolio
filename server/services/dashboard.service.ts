import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { getArtworkCount } from "@server/services/artworks.service";
import { getOrderCount } from "@server/services/orders.service";

// To Do: move out to service layer
export async function getDashboardStats(supabase: SupabaseClient<Database>) {
  try {
    const artworkCount = await getArtworkCount(supabase);
    const orderCount = await getOrderCount(supabase);

    return { artworkCount, orderCount };
  } catch (err) {
    console.log(err);
    throw new Error("Error retrieving dashboard stats: " + err);
  }
}

export async function testFunction() {
  console.log("Testing"); // try importing this
}
