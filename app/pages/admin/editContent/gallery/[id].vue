<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

// To Do: implement edit gallery functionality
// To Do: refactor - this is basically a copy of ArtworkGallery component

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];

const route = useRoute();

// To Do: fix - id will be undefined on first render
const artworkId = computed(() => route.params.id as string); // Issue

const { addArtworkImages } = useArtworks();
const { deleteImage } = useGallery();

const viewFileUpload = ref(false);

const offset = ref(0);
// const limit = 1;

function nextImage() {
  if (!gallery?.value) return;
  if (offset.value < gallery.value.length - 1) offset.value++;
}

function prevImage() {
  if (offset.value > 0) {
    offset.value--;
  }
}

function toggleFileUpload() {
  viewFileUpload.value = !viewFileUpload.value;
}

async function uploadFiles(files: File[]) {
  console.log("Files to upload:", files);
  toggleFileUpload();
  const result = await addArtworkImages(artworkId.value, files);
  alert(result?.message || "");
}

async function removePhoto(id: string) {
  console.log("removing photo!");
  const res = await deleteImage(id);
  alert(res.message);
}

const {
  data: gallery,
  pending,
  error,
} = useFetch<GalleryRow[]>(`/api/artworks/gallery/${artworkId.value}`);
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
    <div class="textBlock">
      <h1>Artworks</h1>
    </div>
    <div class="artworksGrid">
      <div v-for="g in gallery" :key="g.id" class="artworkContainer clickable">
        <img :src="g?.image_path ?? undefined" alt="" class="artwork" />
        <Button variant="danger" @click="removePhoto(g.id)">Remove</Button>
      </div>
    </div>
  </div>
  <div v-else>No gallery images available.</div>
  <Button variant="primary" @click="toggleFileUpload">Add Photos</Button>
</template>

<style>
.artworkContainer {
  padding: 0.5rem;
  background-color: var(--theme-white);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.artDetails {
  font-size: 0.9rem;
  line-height: 1rem;
}
.soldArtwork {
  opacity: 0.4;
  filter: grayscale(70%);
}

.artworksGrid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.artwork {
  width: 5rem;
  height: 5rem;
  border-radius: 8px;
  object-fit: cover;
}

.clickable {
  cursor: pointer;
}

@media (min-width: 768px) {
  .artworksGrid {
    width: 80%;
  }
}

@media (min-width: 1024px) {
  .artworksGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
