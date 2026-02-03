<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

// To Do: implement edit gallery functionality

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];

const route = useRoute();

const artworkId = computed(() => route.params.id as string);

const { addArtworkImages } = useArtworks();

const viewFileUpload = ref(false);

function toggleFileUpload() {
  // Functionality to add images to the gallery will be implemented here
  viewFileUpload.value = !viewFileUpload.value;
}

async function uploadFiles(files: File[]) {
  // Functionality to handle file uploads will be implemented here
  console.log("Files to upload:", files);
  toggleFileUpload();
  const result = await addArtworkImages(artworkId.value, files);
  if (!result?.success) {
    alert("Failed to upload images!");
  } else {
    alert("Images uploaded successfully!");
  }
}

const {
  data: gallery,
  pending,
  error,
} = useFetch<GalleryRow>(`/api/galleries/${artworkId.value}`);
</script>

<template>
  <h1>Gallery</h1>
  <div v-if="pending">Loading gallery images...</div>
  <div v-if="error">Failed to get gallery</div>
  <FileUpload
    v-if="viewFileUpload"
    @close="toggleFileUpload"
    @upload="uploadFiles"
  />
  <div v-if="gallery">
    <div v-for="image in gallery" :key="gallery.id" class="gallery-image">
      <img :src="gallery?.image_path ?? undefined" alt="Gallery Image" />
    </div>
  </div>
  <div v-else>No gallery images available.</div>
  <Button variant="primary" @click="toggleFileUpload">Add Photos</Button>
</template>
