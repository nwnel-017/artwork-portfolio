<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
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

const {
  data: collections,
  pending,
  error,
} = await useFetch<Collection[]>("/api/collections/collections");

async function deleteCollection(id: string) {
  if (!id) return;
  try {
    await $fetch(`/api/collections/${id}`, {
      method: "DELETE",
    });
    alert("Successfully deleted collection!");
    window.location.reload();
  } catch (err) {
    alert("Something went wrong!");
  }
}

const addCollection = () => {
  navigateTo("/admin/newContent/addCollection");
};
</script>

<template>
  <div class="verticalContent padded">
    <div class="fullWidth bannerWide horizontalContent padded">
      <h1>Collections</h1>
      <Button class="buttonCol" @click="addCollection">Add Collection</Button>
    </div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Something went wrong</div>
    <div v-else class="fullWidth">
      <div class="horizontalContent fullWidth padded">
        <div v-if="pending">Loading Artworks...</div>
        <div v-else-if="error">No artworks</div>
        <div v-else class="fullWidth">
          <div class="artworksGrid">
            <div
              v-for="collection in collections"
              :key="collection.id"
              class="artworkContainer spaceBetween clickable"
            >
              <span class="cutoffText">{{ collection?.collection_name }}</span>

              <Button variant="danger" @click="deleteCollection(collection.id)"
                >Remove</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
