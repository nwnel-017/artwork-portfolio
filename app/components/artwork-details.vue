<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

defineProps<{
  artwork: ArtworkRow;
}>();

const emit = defineEmits(["close", "checkout"]);

// async function checkout() {
//   await navigateTo("/payments/checkout");
// }
</script>

<template>
  <div class="overlay" @click.self.stop="emit('close')">
    <div class="modal">
      <h1>Artwork Details</h1>
      <div>{{ artwork?.title }}</div>
      <div>{{ artwork?.description }}</div>
      <div>Dimensions: {{ artwork?.dimensions }}</div>
      <div>${{ artwork?.price }}</div>
      <div>Created: {{ artwork?.created_at }}</div>
      <Button @click.self.stop="emit('checkout')">Buy Now</Button>
    </div>
  </div>
</template>

<style>
.overlay {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  z-index: 1;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  opacity: 1;
}
</style>
