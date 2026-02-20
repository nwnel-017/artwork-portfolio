<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "default",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const route = useRoute();

const collectionId = computed(() => route.params.id as string);

const {
  data: artworks,
  pending,
  error,
} = await useFetch<ArtworkRow[]>(`/api/collections/${collectionId.value}`);

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="availableArtworks" />
  </div>
</template>
