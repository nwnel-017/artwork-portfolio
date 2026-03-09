<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import type { CollectionDetails } from "~~/types/collections/collection";

definePageMeta({
  layout: "default",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

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

// const description = computed(() => {
//   return collectionDescription.value ?? "";
// });

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
