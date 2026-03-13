<script lang="ts" setup>
definePageMeta({
  layout: "default",
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
