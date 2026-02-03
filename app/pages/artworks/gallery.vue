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

// const displayArtworkPopup = ref(false);
// const selectedArtwork = ref<ArtworkRow | null>(null);

// function openPopup(artwork: ArtworkRow) {
//   if (artwork?.sold) return;
//   selectedArtwork.value = artwork;
//   displayArtworkPopup.value = true;
// }

// function closePopup() {
//   selectedArtwork.value = null;
//   displayArtworkPopup.value = false;
// }

// async function payWithStripe() {
//   try {
//     const { url } = await $fetch<{ url: string }>(
//       "/api/stripe/create-checkout-session",
//       {
//         method: "POST",
//         body: {
//           artworkId: selectedArtwork.value?.id,
//         },
//       },
//     );

//     if (url) {
//       window.location.href = url;
//     }
//   } catch (err) {
//     console.log(
//       "There was an error retrieving Stripe checkout session: " + err,
//     );
//     throw new Error("Failed to retrieve stripe checkout session");
//   }
// }
</script>

<template>
  <div class="verticalContent fullWidth">
    <ArtworkGallery :artworks="artworks || []" />
  </div>
</template>

<style scoped>
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
