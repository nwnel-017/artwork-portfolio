<script lang="ts" setup>
definePageMeta({
  layout: false,
});

type Artwork = {
  id: string;
  title: string;
  description: string;
  image_path: string;
  sold: boolean;
  price: number;
  created_at: string;
};

const {
  data: artwork,
  pending,
  error,
} = await useFetch<Artwork>("/api/artworks/latest-artwork");
</script>

<template>
  <div class="verticalContent fullWidth">
    <div class="landingPad">
      <h1>Welcome</h1>
      <div>Bringing art to life</div>
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Failed to load artwork</div>
      <img
        v-else-if="artwork"
        :src="artwork?.image_path ?? undefined"
        alt="Artwork"
        class="artworkLg"
      />
      <Button @click="navigateTo('/artworks/gallery')">View Gallery</Button>
      <div class="imageContainer"></div>
      <Button variant="secondary" @click="navigateTo('/about')"
        >About the Artist</Button
      >
      <img src="" alt="" />
    </div>
  </div>
</template>

<style scoped>
.landingPad {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.landingPad h1 {
  margin: 0;
}

.imageContainer {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.artworkLg {
  max-width: 90%;
  max-height: 60vh;
}
</style>
