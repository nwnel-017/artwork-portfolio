<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import { toast } from "vue-sonner";
type CollectionRow = Database["public"]["Tables"]["collections"]["Row"]; // look for cleaner way later;
type Collection = {
  id: string;
  collection_name: string;
  created_at: string;
  image_path: string;
};

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { startLoading, stopLoading } = useLoading();
const { deleteCollection } = useCollections();
// To Do: collections text now doesnt overflow correctly - but width:100% makes it too big - make cells smalelr

// To Do: refactor to use composable in a correct way
const {
  data: collections,
  pending,
  error,
} = await useFetch<Collection[]>("/api/collections/collections");

// same with this
async function removeCollection(id: string) {
  if (!id) return;
  try {
    startLoading();
    await deleteCollection(id);
    toast.success("Successfully deleted collection!");
    window.location.reload();
  } catch (err) {
    toast.error("Something went wrong!");
  } finally {
    stopLoading();
  }
}

const addCollection = () => {
  navigateTo("/admin/newContent/addCollection");
};
</script>

<template>
  <div class="verticalContent padded marginTop">
    <!-- <div class="fullWidth bannerWide horizontalContent padded">
      <h1>Collections</h1>
      <Button class="buttonCol" @click="addCollection">Add Collection</Button>
    </div> -->
    <div class="textBlock horizontalContent spaceBetween largeWidth">
      <h1>Collections</h1>
      <Button class="buttonCol" @click="addCollection">Add</Button>
    </div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Something went wrong</div>
    <div v-else-if="collections" class="collectionsGridInternal">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="collectionContainer clickable"
      >
        <img
          :src="collection?.image_path ?? undefined"
          alt=""
          class="collectionImg"
        />
        <div class="collectionDetails">
          <div>{{ collection?.collection_name }}</div>
          <Button variant="danger" @click="removeCollection(collection.id)"
            >Remove</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collectionsGridInternal {
  display: grid;
  justify-items: center;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}
</style>
