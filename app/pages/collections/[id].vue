<script lang="ts" setup>
import type { ArtworkRow } from "~~/types/supabase/tables";
import type { CollectionDetails } from "~~/types/collections/collection";

definePageMeta({
  layout: "default",
});

const route = useRoute();

const collectionId = computed(() => route.params.id as string);

const {
  data: artworks,
  pending: artworksPending,
  error: artworksError,
} = await useFetch<ArtworkRow[]>(`/api/collections/${collectionId.value}`);

const {
  data: collectionDetails,
  pending: getCollectionDetailsPending,
  error: getCollectionDetailsError,
} = await useFetch<CollectionDetails>(
  `/api/collections/details/${collectionId.value}`,
);

useSeoMeta({
  title: () => collectionDetails.value?.collection_name || "Collection",
  description: () =>
    collectionDetails.value?.description ||
    `Explore artworks from the ${collectionDetails.value?.collection_name || "featured"} collection by Jamie Nelson.`,
  ogTitle: () => collectionDetails.value?.collection_name || "Collection",
  ogDescription: () =>
    collectionDetails.value?.description ||
    `Explore artworks from the ${collectionDetails.value?.collection_name || "featured"} collection by Jamie Nelson.`,
  ogImage: () => collectionDetails.value?.image_path || undefined,
});

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery
      :artworks="artworks ?? []"
      :collection="collectionDetails"
    />
  </div>
</template>
