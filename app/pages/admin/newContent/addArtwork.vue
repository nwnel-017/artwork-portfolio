<script lang="ts" setup>
// import DropDown from "~/components/drop-down.vue";
// import type { Artist } from "#types/artists.ts";
import type { ArtworkData } from "#types/artworks/artworks.ts";
import type { Database } from "#types/supabase/database";
import type { DropDown } from "#types/dropdown/dropdown";

type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { addArtwork } = useArtworks();
const { getCollections } = useCollections();

const image = ref<File | null>(null);

const artwork = reactive<ArtworkData>({
  title: "",
  description: "",
  price: "",
  dimensions: "",
  collection: "",
});

// To Do: research which is better - this way or using async data in artworks/id.vue
const {
  data: collections,
  pending: loadingCollections,
  error: collectionError,
} = await getCollections();

const collectionItems = computed<DropDown[]>(
  () =>
    collections.value?.map((c) => ({
      label: c.collection_name ?? "",
      value: c.id ?? "",
    })) ?? [{ label: "", value: "" }],
);

function selectCollection(collection: DropDown) {
  if (!collection) return;
  artwork.collection = collection.value;
  console.log("selected collection: " + artwork.collection);
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0] || null;
  image.value = selected;
};

const submit = async () => {
  // To Do: send ArtworkData object instead of fields
  const response = await addArtwork(
    artwork.title,
    artwork.description,
    image.value,
    artwork.dimensions,
    artwork.price,
    artwork.collection,
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
      <DropDown
        label="Collection"
        :items="collectionItems ?? []"
        @select="selectCollection"
      />
      <button variant="primary" type="submit" size="sm">Submit</button>
    </form>
  </div>
</template>
