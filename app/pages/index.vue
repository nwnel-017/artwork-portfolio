<script lang="ts" setup>
definePageMeta({
  layout: "default",
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
  data: artworks,
  pending,
  error,
} = await useFetch<Artwork[]>("/api/artworks/latest-artwork");
</script>

<template>
  <div class="verticalContent fillPage">
    <div class="landingPad">
      <div class="lndPadImgContainer">
        <div v-if="pending">Loading...</div>
        <div v-else-if="error">Failed to load content</div>
        <NuxtImg
          v-else-if="artworks && artworks?.length > 0"
          :src="artworks[0]?.image_path ?? undefined"
          alt="Artwork"
          class="artworkLg"
        />
      </div>
      <div class="landingText">
        <h1>WELCOME</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landingPad {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.lndPadImgContainer {
  width: 100%;
  height: 8rem;
  overflow: hidden;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.landingText {
  text-align: center;
  width: 90%;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .lndPadImgContainer {
    height: 20rem;
  }

  p {
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .lndPadImgContainer {
    height: 100vh;
  }
}
</style>
