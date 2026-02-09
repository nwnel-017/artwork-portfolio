<script lang="ts" setup>
// import DropDown from "~/components/drop-down.vue";
// import type { Artist } from "#types/artists.ts";
import type { ArtworkData } from "#types/artworks/artworks.ts";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { addArtwork } = useArtworks();

// const { data: artistsList } = await useFetch<Artist[]>("/api/artists/artists");
// const typedArtistsList = artistsList as Ref<Artist[] | null>;

const image = ref<File | null>(null);

const artwork = reactive<ArtworkData>({
  title: "",
  description: "",
  price: "",
  dimensions: "",
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0] || null;
  image.value = selected;
};

// find artist and set artwork.artist to selected artist
// const selectArtist = (artistName: string) => {
//   console.log("Selected artist: " + artistName);
//   const selectedArtist = artistsList?.value?.find(
//     (artist) => artist.name === artistName
//   );

//   if (selectedArtist) {
//     artwork.artist = selectedArtist.id.toString();
//   } else {
//     artwork.artist = "";
//   }
// };

const submit = async () => {
  // To Do: send ArtworkData object instead of fields
  const response = await addArtwork(
    artwork.title,
    artwork.description,
    image.value,
    artwork.dimensions,
    artwork.price,
  );

  if (!response.success) {
    alert(response.message);
    return;
  }

  alert(response.message);
  artwork.title = "";
  artwork.description = "";
  image.value = null;
  artwork.price = "";
  artwork.dimensions = "";

  await navigateTo("/admin/artworks");
};
</script>

<template>
  <div class="verticalContent">
    <h1>Add Artwork here!</h1>
    <form @submit.prevent="submit" class="submissionForm">
      <label for="title">Title</label>
      <input type="text" v-model="artwork.title" />
      <label for="description">Artwork description</label>
      <input type="text" v-model="artwork.description" />
      <label for="price">Price (USD)</label>
      <input type="text" v-model="artwork.price" inputmode="decimal" />
      <label for="dimensions">Dimensions</label>
      <input type="text" v-model="artwork.dimensions" />
      <label for="image">Artwork Image</label>
      <input @change="onFileChange" name="image" accept="image" type="file" />
      <!-- <label for="publishDate">Publish On</label>
      <input type="date" name="publishDate" v-model="artwork.publishDate" /> -->
      <!-- <DropDown
            label="Artist"
            @select="selectArtist"
            :items="artistsList?.map((artist) => artist.name) || []"
          /> -->
      <button variant="primary" type="submit" size="sm">Submit</button>
    </form>
  </div>
</template>
