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
      <div class="landingText">
        <h1>WELCOME</h1>
        <!-- <p>Hello, my name is Jamie Nelson.</p>
        <p>
          I am a 26-year-old artist from Zimbabwe, currently based in Puerto
          Rico. I grew up in Zimbabwe surrounded by diversity—of people,
          languages, patterns, and color. That environment deeply shaped the way
          I see and make art. Living in Mexico, Chile, the United States, and
          now Puerto Rico has further expanded my fascination with culture and
          the visual languages that emerge from everyday life. I was raised
          seeing Zimbabwean artists create powerful work despite economic
          limitations, often using recycled materials and found objects.
        </p>
        <p>
          Inspired by this resourcefulness, I began collecting old magazines
          instead of buying expensive paints, creating collages through layering
          and texture. This approach sparked my ongoing interest in mixed media.
          I often continue this practice by working on reclaimed canvases,
          painting over existing surfaces as a way of extending their life and
          engaging with ideas of layering, memory, and renewal. Alongside
          figurative work, I am inspired by flowers and nature, drawn to organic
          colours, textures, and patterns that feel limitless. Plant life has
          become a way for me to explore ideas of home, memory, and hope—both
          personal and cultural.
        </p>
        <p>
          My artistic practice is also shaped by my Christian faith. Rather than
          something I seek to explain or instruct through my work, it quietly
          informs the way I see the world: as something marked by brokenness,
          yet filled with beauty, meaning, and hope. I am inspired by the belief
          that people and nature carry inherent worth, and that one day all
          things will be restored.
        </p>
        <p>
          Although I have lived in different parts of the world, my work
          continues to draw from Zimbabwe—especially the people who carry joy,
          strength, and dignity through struggle. Themes of beauty, resilience,
          joy, and hope run throughout my practice, whether through human
          figures or plants. Thank you for taking the time to view my work and
          support my creative journey.
        </p>
        <p>— Jamie</p> -->
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
