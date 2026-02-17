<script lang="ts" setup>
import { formatDateShort } from "#imports";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { getArtworks } = useArtworks();

const { data: artworks, error, pending } = await getArtworks();

const addArtwork = () => {
  navigateTo("/admin/newContent/addArtwork");
};

const editArtwork = (artworkId: string) => {
  navigateTo(`/admin/editContent/artworks/${artworkId}`);
};
</script>

<template>
  <div class="verticalContent fullWidth paddedT">
    <div class="horizontalContent banner padded">
      <h1>Artworks</h1>
      <Button class="buttonCol" @click="addArtwork">Add Artwork</Button>
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
            <div class="imageCell">
              <img
                :src="artwork?.image_path ?? undefined"
                alt=""
                class="artworkImg"
              />
            </div>
            <div class="cutoffText gridText">{{ artwork?.title }}</div>
            <div class="cutoffText gridText">
              ${{ artwork.price ?? `$${0.0}` }}
            </div>
            <div class="created gridText">
              {{ formatDateShort(artwork?.created_at) ?? "" }}
            </div>
            <div class="btnContainer">
              <Button
                variant="secondary"
                @click="editArtwork(artwork?.id)"
                class="buttonCol"
                >Edit</Button
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gridText {
  display: flex;
  align-items: center;
}

.imageCell {
  width: 45px;
  height: 45px;
}

.artworkImg {
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid var(--text-color);
  box-shadow: 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.internalArtGrid {
  width: 100%;
  display: grid;
  margin: auto;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  align-content: flex-start;
  /* box-shadow: 2px 4px rgba(0, 0, 0, 0.1); */
}

/* .header {
  font-weight: bold;
} */

/* .buttonCol {
  width: 100px;
} */

.created {
  display: none;
}

.btnContainer {
  display: flex;
  justify-content: end;
  align-items: center;
}

@media (min-width: 768px) {
  .internalArtGrid {
    width: 90%;
  }

  .imageCell {
    width: 60px;
    height: 60px;
  }

  .buttonCol {
    width: 120px;
  }
}

@media (min-width: 1024px) {
  .internalArtGrid {
    width: 60%;
    grid-template-columns: repeat(5, 1fr);
  }
  .created {
    display: flex;
  }
}
</style>
