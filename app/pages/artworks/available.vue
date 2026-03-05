<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "default",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const { getArtworks } = useArtworks();
const imagesLoaded = ref(false);

// const {
//   data: artworks,
//   pending,
//   error,
// } = await useFetch<ArtworkRow[]>("/api/artworks/artworks");

const { data: artworks, pending, error } = await getArtworks();

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);

// To Do: figure out how to do this correctly - we want to display the skeleton loader is the child while
// the images are loading
// passing imagesLoaded as a prop doesnt work because that prop is not reactive in the child component
// watch(
//   availableArtworks,
//   async (val) => {
//     if (!val?.length) return;
//     imagesLoaded.value = false;

//     if (val) {
//       const imagePromises = val.map((artwork) => {
//         return new Promise((resolve) => {
//           const img = new Image();
//           img.src = artwork?.image_path ?? "";
//           img.onload = () => resolve(true);
//           img.onerror = () => resolve(true);
//         });
//       });

//       await Promise.all(imagePromises);
//       imagesLoaded.value = true;
//     }
//   },
//   { immediate: true },
// );
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="availableArtworks" />
  </div>
</template>
