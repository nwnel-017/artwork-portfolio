<script lang="ts" setup>
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Available Artwork",
  description:
    "Browse currently available original artworks by Jamie Nelson and view pieces that are ready for purchase.",
  ogTitle: "Available Artwork",
  ogDescription:
    "Browse currently available original artworks by Jamie Nelson and view pieces that are ready for purchase.",
});

const { getArtworks } = useArtworks();
const imagesLoaded = ref(false);

const { data: artworks, pending, error } = await getArtworks();

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="availableArtworks" />
  </div>
</template>
