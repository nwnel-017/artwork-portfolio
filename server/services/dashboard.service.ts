import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import {
  getArtworkCount,
  getSoldArtworkCount,
} from "@server/services/artworks.service";
import { getOrderCount } from "@server/services/orders.service";
import { getPositionOfLineAndCharacter } from "typescript";

// To Do: move out to service layer
export async function getDashboardStats(supabase: SupabaseClient<Database>) {
  try {
    const artworkCount = await getArtworkCount(supabase);
    const soldArtworks = await getSoldArtworkCount(supabase);
    const orderCount = await getOrderCount(supabase);

    return { artworkCount, soldArtworks, orderCount };
  } catch (err) {
    console.log(err);
    throw new Error("Error retrieving dashboard stats: " + err);
  }
}
