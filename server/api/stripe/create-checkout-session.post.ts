import { Stripe } from "stripe";

export default defineEventHandler(async (event) => {
  // To Do:
  // 1.) take in artwork id from body
  // 2.) lookup artwork price on server
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.public.stripeSecretKey);
  const amount = 1000;
  const currency = "usd";

  const body = await readBody(event);
  const artworkId = body?.artworkId;
  if (!artworkId) {
    console.log("Missing artwork ID in the body");
    throw createError({ statusCode: 400, statusMessage: "Bad Request," });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: "Nuxt 4 Stripe Payment",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ["US", "CA"], // or any countries you support
    },
    metadata: {
      artworkId: artworkId,
      price: 1000, // To Do: we need to look up price from the server
    },
    success_url: `${
      getRequestURL(event).origin
    }/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getRequestURL(event).origin}/payments/cancel`,
  });

  return { url: session.url };
});
