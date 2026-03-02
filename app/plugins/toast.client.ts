import { createToaster } from "@meforma/vue-toaster";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const toaster = createToaster({
    position: "bottom-left",
    maxToasts: 5, // Display at most 5 toasts at a time
  });
});
