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
      <Button @click="addArtwork">Add Artwork</Button>
    </div>
    <div class="horizontalContent fullWidth padded">
      <div v-if="pending">Loading Artworks...</div>
      <div v-else-if="error">No artworks</div>
      <div v-else class="fullWidth">
        <div class="internalArtGrid">
          <div class="header image">Image</div>
          <div class="header title">Title</div>
          <div class="header price">Price</div>
          <div class="header created">Created</div>
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
            <div class="cutoffText">{{ artwork?.title }}</div>
            <div class="cutoffText">${{ artwork.price ?? `$${0.0}` }}</div>
            <div class="created">
              {{ formatDateShort(artwork?.created_at) ?? "" }}
            </div>
            <Button variant="secondary" @click="editArtwork(artwork?.id)"
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
  /* max-width: 15vh; TO DO --- fix to make images appear correctly */
  /* max-height: 15vh; */
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid black;
  object-fit: cover;
}

.internalArtGrid {
  width: 100%;
  display: grid;
  margin: auto;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  align-content: flex-start;
}

/* .internalArtGrid > * {
  border: 1px solid black;
} */

.header {
  font-weight: bold;
}

.created {
  display: none;
}

.btnContainer {
  display: flex;
  justify-content: end;
  /* align-items: center; */
}

@media (min-width: 768px) {
  .internalArtGrid {
    width: 90%;
    /* align-content: flex-start; */
  }
}

@media (min-width: 1024px) {
  .internalArtGrid {
    width: 60%;
    grid-template-columns: repeat(5, 1fr);
  }
  .created {
    display: block;
  }
}
</style>
