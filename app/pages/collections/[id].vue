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

const availableArtworks = computed(
  () => artworks.value?.filter((artwork) => !artwork.sold) || [],
);
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery
      :artworks="availableArtworks"
      :collection="collectionDetails"
    />
  </div>
</template>
