<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

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
    <div class="horizontalContent fullWidth banner">
      <h1>Artworks</h1>
      <Button @click="addArtwork">Add Artwork</Button>
    </div>
    <div class="horizontalContent fullWidth padded">
      <div v-if="pending">Loading Artworks...</div>
      <div v-else-if="error">No artworks</div>
      <div v-else class="fullWidth">
        <div v-for="artwork in artworks" :key="artwork?.id" class="contentCard">
          <div class="closeHorContent">
            <img
              :src="artwork?.image_path ?? undefined"
              alt=""
              class="headShotSm"
            />
            <div>{{ artwork?.title }}</div>
            <div>{{ artwork?.description }}</div>
            <div class="cutoffText">{{ artwork.price ?? `$${0.0}` }}</div>
            <div>{{ artwork?.publish_on }}</div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            @click="editArtwork(artwork?.id)"
            >Edit</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.headShotSm {
  max-width: 5vw;
  max-height: 5vw;
  border-radius: 8px;
}
</style>
