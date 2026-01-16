import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import type { ShippingDetail } from "@utils/validation/stripe";
import { id } from "zod/locales";

export async function getOrders(supabase: SupabaseClient<Database>) {
  if (!supabase) {
    throw new Error("Missing supabase client");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, artwork_id, amount, status, created_at, updated, address_line_1, buyer_email"
    );

  if (error || !data) {
    console.log("Error getting orders from supabase: " + error?.message);
    throw new Error("Failed to get orders!");
  }

  return data;
}

export async function getOrderCount(supabase: SupabaseClient<Database>) {
  const { count: orderCount, error: orderError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  if (orderError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total order count",
        details: orderError.message,
      },
    });
  }

  return orderCount || 0;
}

export async function createOrder(
  supabase: SupabaseClient<Database>,
  artworkId: string,
  userEmail: string,
  price: string,
  address: ShippingDetail
) {
  if (!supabase || !address || !artworkId || !price || !userEmail) {
    throw new Error("Missing Parameters!");
  }

  const shippingCountry = address.country;
  const shippingCity = address.city;
  const shippingLine1 = address.line1;
  const zip = address.postal_code;
  const shippingState = address.state;

  if (
    !shippingCountry ||
    !shippingCity ||
    !shippingLine1 ||
    !zip ||
    !shippingState
  ) {
    throw new Error("Missing expected fields for shipping address");
  }

  const numericPrice = Number(price);

  if (isNaN(numericPrice)) {
    throw new Error("Invalid price: not a number");
  }

  console.log("artwork id: " + artworkId); //artwork Id is email - this is why
  console.log("email: " + userEmail); // this is the artwork id????
  // To Do: fix error - supabase is attempting to insert buyer_email to uuid column?
  const { error } = await supabase.from("orders").insert({
    address_line_1: shippingLine1,
    address_line_2: address?.line2 || "",
    artwork_id: artworkId,
    buyer_email: userEmail, // invalid syntax type for uuid
    city: shippingCity,
    country: shippingCountry,
    amount: numericPrice,
    state: shippingState,
    postal_code: zip,
  });

  if (error) {
    console.log("Error inserting order: " + error?.message);
    throw new Error("Failed to create order!");
  }
}

export async function updateOrderStatusById(
  supabase: SupabaseClient<Database>,
  orderId: string,
  status: string
) {
  if (!supabase || !orderId || !status) {
    throw new Error("Missing parameters");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId);
  if (error || !order) {
    console.log("Order not found in database");
    throw new Error("No order found in database");
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: status,
    })
    .eq("id", orderId);

  if (updateError) {
    console.log("Failed to update order: " + updateError.message);
    throw new Error("Failed to update order!");
  }
}
