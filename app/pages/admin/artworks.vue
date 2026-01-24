<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import { formatDateShort } from "#imports";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const {
  data: artworks,
  error,
  pending,
} = await useFetch<ArtworkRow[]>("/api/artworks/artworks");

// why is this type now required??
type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const addArtwork = () => {
  navigateTo("/admin/newContent/addArtwork");
};

const editArtwork = (artworkId: string) => {
  navigateTo(`/admin/editContent/artworks/${artworkId}`);
};
</script>

<template>
  <div class="verticalContent fullWidth">
    <div class="horizontalContent banner padded">
      <h1>Artworks</h1>
      <Button @click="addArtwork" size="sm">Add Artwork</Button>
    </div>
    <div class="horizontalContent fullWidth padded">
      <div v-if="pending">Loading Artworks...</div>
      <div v-else-if="error">No artworks</div>
      <div v-else class="fullWidth">
        <div class="internalArtGrid">
          <div class="header">Image</div>
          <div class="header">Title</div>
          <div class="header">Price</div>
          <div class="header">Created</div>
          <div class="header"></div>
          <template
            v-for="artwork in artworks"
            :key="artwork?.id"
            class="contentCard"
          >
            <img
              :src="artwork?.image_path ?? undefined"
              alt=""
              class="artworkImg"
            />
            <div>{{ artwork?.title }}</div>
            <div class="cutoffText">${{ artwork.price ?? `$${0.0}` }}</div>
            <div>{{ formatDateShort(artwork?.created_at) ?? "" }}</div>
            <Button
              size="sm"
              variant="secondary"
              @click="editArtwork(artwork?.id)"
              >Edit</Button
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artworkImg {
  max-width: 10vw;
  max-height: 10vh;
  border-radius: 8px;
}

.internalArtGrid {
  width: 100%;
  display: grid;
  margin: auto;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  /* box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04); */
}

.header {
  font-weight: bold;
}

@media (min-width: 768px) {
}
</style>
