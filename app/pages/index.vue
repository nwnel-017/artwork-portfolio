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
  data: artwork,
  pending,
  error,
} = await useFetch<Artwork>("/api/artworks/latest-artwork");
</script>

<template>
  <div class="verticalContent fillPage">
    <div class="landingPad">
      <div class="lndPadImgContainer">
        <div v-if="pending">Loading...</div>
        <div v-else-if="error">Failed to load content</div>
        <img
          v-else-if="artwork"
          :src="artwork?.image_path ?? undefined"
          alt="Artwork"
          class="artworkLg"
        />
      </div>
      <div>
        <p>Jamie Nelson is an creative person. Very very creative.</p>
        <p>
          She makes lots of art. And it is very very good. She also knows how to
          cook very well.
        </p>
        <p>
          She enjoys lots of things. Everyday she does something, and not a
          single day goes by where she does not do some kind of thing.
        </p>
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
  height: 6rem;
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

p {
  text-align: center;
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
