// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],
  modules: ["@nuxtjs/supabase"],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },

  runtimeConfig: {
    public: {
      admin: process.env.ADMIN_EMAIL,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  alias: {
    "@server": fileURLToPath(new URL("./server", import.meta.url)),
    "#types": fileURLToPath(new URL("./types", import.meta.url)),
    "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
  },
});
