<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "default",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later

const {
  data: artworks,
  pending,
  error,
} = await useFetch<ArtworkRow[]>("/api/artworks/artworks");

const displayArtworkPopup = ref(false);
const selectedArtwork = ref<any | null>(null);

function openPopup(artwork: any) {
  selectedArtwork.value = artwork;
  displayArtworkPopup.value = true;
}

function closePopup() {
  selectedArtwork.value = null;
  displayArtworkPopup.value = false;
}

async function payWithStripe() {
  try {
    const { url } = await $fetch<{ url: string }>(
      "/api/stripe/create-checkout-session",
      {
        method: "POST",
        body: {
          artworkId: selectedArtwork.value,
        },
      }
    );

    if (url) {
      window.location.href = url;
    }
  } catch (err) {
    console.log(
      "There was an error retrieving Stripe checkout session: " + err
    );
    throw new Error("Failed to retrieve stripe checkout session");
  }
}
</script>

<template>
  <div class="verticalContent">
    <ArtworkDetails
      v-if="displayArtworkPopup && selectedArtwork"
      :artwork="selectedArtwork.value"
      @close="closePopup"
      @checkout="payWithStripe"
    />
    <div>
      <h1>Artworks</h1>
      <!-- <div class="trasparent"> -->
      <div v-if="pending">Loading Artworks...</div>
      <div v-else-if="error">Failed to get artworks: {{ error }}</div>
      <div v-else class="artworksGrid">
        <div
          v-for="artwork in artworks"
          :key="artwork.id"
          @click="openPopup(artwork.id)"
        >
          <img :src="artwork?.image_path ?? undefined" alt="" class="artwork" />
          <div>{{ artwork?.title }}</div>
          <div>{{ artwork?.description }}</div>
          <div>{{ artwork?.price }}</div>
          <!-- <div>{{ artwork.artist }}</div> -->
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.artworksGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.artwork {
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 8px;
  cursor: pointer;
}

/* .transparent {
    opacity: 0.5;
  } */
</style>
