import { stripe } from "@server/utils/stripe/stripe";
import { Stripe } from "stripe";
import { serverSupabaseClient } from "#supabase/server";
import { createOrder } from "@server/services/orders.service";
import {
  ShippingDetail,
  validateShippingAddress,
} from "@utils/validation/stripe";

export default defineEventHandler(async (event) => {
  console.log("stripe webhook has been reached");

  const config = useRuntimeConfig();
  const stripeWebhookSecret = config.public.stripeWebhookSecret;
  const rawBody = await readRawBody(event);
  const signature = getHeader(event, "stripe-signature");

  if (!signature || !rawBody) {
    throw createError({ statusCode: 400, message: "Bad Request" });
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody!,
      signature!,
      stripeWebhookSecret
    );
  } catch (err) {
    console.log("An error occured reading the event: " + err);
    throw new Error("Failed to retrieve event!");
  }

  switch (stripeEvent.type) {
    case "checkout.session.completed":
      console.log("processed payment event detected");
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      const artworkId = session.metadata?.artworkId;
      // const amount = session.metadata?.price;
      const userEmail = session.customer_details?.email;
      const shipping = session.customer_details?.address;
      const price = session.metadata?.price;

      const validatedShippingAddress: ShippingDetail =
        validateShippingAddress(shipping);

      if (!artworkId || !userEmail || !shipping || !price) {
        throw new Error("Missing required parameters!");
      }

      // To Do: insert order details into orders table
      try {
        const supabase = await serverSupabaseClient(event);
        await createOrder(
          supabase,
          artworkId,
          userEmail,
          price,
          validatedShippingAddress
        );
      } catch (err) {
        console.log("Something went wrong: " + err);
        throw new Error("Something went wrong!");
      }
  }
});
