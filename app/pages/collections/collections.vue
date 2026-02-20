<script lang="ts" setup>
import { useCollections } from "#imports";

definePageMeta({
  layout: "default",
});

const { getCollections } = useCollections();

// To Do: do we need an extra collection type including image_path?
const { data: collections, pending, error } = await getCollections();

async function viewCollection(collectionId: string) {
  console.log(collectionId);
  if (collectionId) {
    await navigateTo(`/collections/${collectionId}`);
  }
}
</script>

<template>
  <div class="verticalContent">
    <div class="textBlock">
      <h1>Collections</h1>
    </div>
    <div v-if="pending"><h1>Loading...</h1></div>
    <div v-else-if="error"><h1>No Collections to Show</h1></div>
    <div v-else-if="collections" class="collectionsGrid">
      <div
        v-for="collection in collections"
        :key="collection.id"
        @click="viewCollection(collection.id)"
        class="collectionContainer clickable"
      >
        <img
          :src="collection?.image_path ?? undefined"
          alt=""
          class="collectionImg"
        />
        <div class="collectionDetails">
          <div>{{ collection?.collection_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
