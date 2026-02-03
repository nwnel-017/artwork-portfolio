<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "default",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const {
  data: artworks,
  pending,
  error,
} = await useFetch<ArtworkRow[]>("/api/artworks/artworks");

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="availableArtworks" />
  </div>
</template>
