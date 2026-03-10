<script setup lang="ts">
import type { ArtworkRow } from "#types/supabase/tables";
import type { Artwork } from "~~/types/artworks/artworks";
import type { CoverImageRow } from "#types/supabase/tables";

const props = defineProps<{
  artworks?: CoverImageRow[];
}>();

const reversed = computed<CoverImageRow[]>(() => {
  if (props.artworks && props.artworks.length > 0) {
    return [...props.artworks].reverse();
  } else {
    return [];
  }
});
</script>

<template>
  <div v-if="props.artworks" class="heroCarousel">
    <div class="carouselStrip row1">
      <div
        v-for="artwork in [...props.artworks, ...props.artworks]"
        :key="artwork.id + 'a'"
        class="imgSquare"
      >
        <div class="square">
          <NuxtImg
            :src="artwork.image_path"
            alt="Artwork Image"
            class="carouselImg"
          />
        </div>
      </div>
    </div>
    <div class="landingText">
      <span>W</span><span>E</span><span>L</span><span>C</span><span>O</span
      ><span>M</span><span>E</span>
    </div>
    <div class="carouselStrip row2">
      <div
        v-for="artwork in [...reversed, ...reversed]"
        :key="artwork.id"
        class="imgSquare"
      >
        <div class="square">
          <NuxtImg
            :src="artwork.image_path"
            alt="Artwork Image"
            class="carouselImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landingText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-evenly;
  width: 50%;
}

.landingText span {
  font-size: 2rem;
  font-weight: bold;
}

.heroCarousel {
  position: relative;
  overflow: hidden;
  height: 90dvh;
  width: 100dvw;
}

.row1 {
  top: 5dvh;
  animation: scrollLeft 45s linear infinite;
}

.row2 {
  bottom: 0dvh;
  animation: scrollRight 45s linear infinite;
}

.carouselStrip {
  position: absolute;
  display: flex;
  flex-direction: row;
  height: 35dvh;
  /* border: 4px solid white; */
}

.carouselSquareContainer {
  width: 100%;
  height: 40dvh;
}

.square {
  width: 20dvh;
  aspect-ratio: 1 / 1;
}

.imgSquare {
  /* height: 100%; */
  /* aspect-ratio: 1 / 1; */
  width: 20dvw;
  height: 100%;
  /* border: 10px solid white; */
}

.carouselImg {
  width: 100%;
  /* height: 100%; */
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

@media (min-width: 1024px) {
  /* .row1 {
    top: 5dvh;
  } */
  .square {
    width: 30dvh;
  }
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes scrollRight {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
