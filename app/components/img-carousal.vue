<script setup lang="ts">
import type { ArtworkRow } from "#types/supabase/tables";
import type { Artwork } from "~~/types/artworks/artworks";

const props = defineProps<{
  artworks?: Artwork[];
}>();

const firstRow = computed(() => {
  if (props.artworks && props.artworks.length > 0) {
    return props.artworks?.slice(0, 2);
  }
});

const secondRow = computed(() => {
  if (props.artworks && props.artworks.length > 0) {
    return props.artworks?.slice(3, 5);
  }
});
</script>

<template>
  <div v-if="props.artworks" class="heroCarousel">
    <div class="row1">
      <div class="carouselStrip">
        <div class="carouselSquareContainer border">
          <div v-for="artwork in firstRow" :key="artwork.id" class="imgSquare">
            <NuxtImg
              :src="artwork.image_path"
              alt="Artwork Image"
              class="carouselImg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="landingText">
    <h1>WELCOME</h1>
  </div> -->
</template>

<style scoped>
.heroCarousel {
  position: relative;
  overflow: hidden;
  height: 80dvh;
}

.row1 {
  top: 10%;
  animation: scrollLeft 30s linear infinite;
}

.row2 {
  bottom: 10%;
  animation: scrollRight 30s linear infinite;
}

.carouselStrip {
  position: absolute;
  width: 600%;
  display: flex;
  overflow: hidden;
}

.carouselSquareContainer {
  width: 100%;
  height: 40dvh;
}

.imgSquare {
  height: 100%;
  width: 30dvw;
}

.carouselImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
