<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later;
type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];

const route = useRoute();
const id = computed(() => route.params.id as string);

const { getGalleryImages } = useGallery();

const {
  data: artwork,
  pending,
  error,
} = await useFetch<ArtworkRow>(`/api/artworks/${id.value}`);

// To Do: research useAsyncData - best practice and why to use
const { data: galleryImages } = await useAsyncData<GalleryRow[]>(
  `gallery-${route.params.id}`,
  () => getGalleryImages(id.value as string),
);

const currentIndex = ref(0);

const currentImage = computed<GalleryRow | null>(() => {
  if (!galleryImages.value) return null;
  return galleryImages.value[currentIndex.value] ?? null;
});

const nextImage = () => {
  const images = galleryImages.value;
  if (!images?.length) return;

  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const prevImage = () => {
  const images = galleryImages.value;
  if (!images?.length) return;

  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
};

async function payWithStripe() {
  try {
    const { url } = await $fetch<{ url: string }>(
      "/api/stripe/create-checkout-session",
      {
        method: "POST",
        body: {
          artworkId: id.value,
        },
      },
    );

    if (url) {
      window.location.href = url;
    }
  } catch (err) {
    console.log(
      "There was an error retrieving Stripe checkout session: " + err,
    );
    throw new Error("Failed to retrieve stripe checkout session");
  }
}
</script>

<template>
  <div>
    <div v-if="pending">Loading</div>
    <div v-else-if="error">Something went wrong</div>
    <div v-else-if="artwork" class="verticalContent">
      <div class="imgContainer flexBetween">
        <ArrowButton direction="left" @click="prevImage" />
        <img
          :src="currentImage?.image_path ?? undefined"
          alt=""
          class="imgLarge clickable"
        />
        <ArrowButton @click="nextImage" />
      </div>
      <div class="clmGap">
        <h1>{{ artwork?.title }}</h1>
        <div>${{ artwork?.price }}</div>
        <div>{{ artwork?.dimensions }}</div>
        <div><strong>About:</strong> {{ artwork?.description }}</div>
        <div>
          <strong>Created On:</strong>
          {{ formatDateShort(artwork?.created_at) }}
        </div>
        <Button @click="payWithStripe">Buy Now</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .imgContainer {
} */
</style>
