<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import { formatDateShort } from "~/utils/date";
import { computed } from "vue";

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const { artwork } = defineProps<{
  artwork: ArtworkRow;
}>();

const emit = defineEmits(["close", "checkout"]);

const formattedDate = computed(() => formatDateShort(artwork?.created_at));
</script>

<template>
  <div class="overlay" @click.self.stop="emit('close')">
    <div class="modal">
      <h1>{{ artwork?.title }}</h1>
      <img :src="artwork?.image_path ?? undefined" alt="" class="artworkFull" />
      <div class="textContent">
        <div>{{ artwork?.description }}</div>
        <div>Dimensions: {{ artwork?.dimensions }}</div>
        <div>Price: ${{ artwork?.price }}</div>
        <div>Created: {{ formattedDate }}</div>
      </div>
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
  max-width: 90%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  opacity: 1;
}

.artworkFull {
  max-width: 15rem;
  max-height: 15rem;
  border-radius: 8px;
}

.textContent {
  margin: 0.5rem 0;
  width: 100%;
  /* border: 2px solid black; */
}

@media (min-width: 768px) {
  .artworkFull {
    max-width: 25rem;
    max-height: 25rem;
  }
}

@media (min-width: 1024px) {
  .artworkFull {
    max-width: 35rem;
    max-height: 35rem;
  }
}
</style>
