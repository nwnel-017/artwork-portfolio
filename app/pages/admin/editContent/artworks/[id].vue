<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
// import type { Artist } from "#types/artists";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later;
type EditedArtwork = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: File | null;
  // published: string | "";
};

const route = useRoute();

const artworkId = computed(() => route.params.id as string);

const {
  data: artwork,
  pending,
  error,
} = useFetch<ArtworkRow>(`/api/artworks/${artworkId.value}`); // why is artwork id an object?

const editedArtwork = ref<EditedArtwork>({
  id: "",
  title: "",
  description: "",
  price: "",
  image: null,
  // published: "",
});

const isEditing = ref(false);

function startEdit() {
  isEditing.value = true;
  editedArtwork.value = {
    id: artworkId.value,
    title: artwork.value?.title || "",
    description: artwork.value?.description || "",
    price: artwork.value?.price?.toString() || "",
    // artist: artwork.value?.artist || "",
    image: null,
    // published: artwork.value?.publish_on || "",
  };
}

function stopEdit() {
  isEditing.value = false;
  editedArtwork.value = {
    id: "",
    title: "",
    description: "",
    // artist: "",
    price: "",
    image: null,
    // published: "",
  };
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target?.files ? target.files[0] : null;
  editedArtwork.value.image = file || null;
}

async function save() {
  console.log("saving!");
  isEditing.value = false;
  const newTitle = editedArtwork.value.title;
  const newDesc = editedArtwork.value.description;
  const newPrice = editedArtwork.value.price;
  //   const newArtist = editedArtwork.value.artist;
  const newImage = editedArtwork.value.image;
  // const newPublishedDate = editedArtwork.value.published;

  if (
    !newTitle ||
    !newDesc ||
    !newPrice ||
    // !newArtist ||
    !newImage
    // !newPublishedDate
  ) {
    console.log("new title: " + newTitle);
    console.log("new desc: " + newDesc);
    console.log("new price: " + newPrice);
    // console.log("new publish date: " + newPublishedDate);
    alert("Missing required fields!");
    return;
  }

  if (
    newTitle === artwork.value?.title &&
    newDesc === artwork.value?.description &&
    newPrice === artwork.value?.price?.toString()
    // newPublishedDate === artwork.value?.publish_on
  ) {
    alert("No changes have been made!");
    return;
  }

  const form = new FormData();
  form.append("id", artworkId.value);
  form.append("title", newTitle);
  form.append("description", newDesc);
  form.append("price", newPrice);
  form.append("image", newImage);
  // form.append("publishDate", newPublishedDate);

  try {
    await $fetch(`/api/artworks/${artworkId.value}`, {
      method: "PUT",
      body: form,
    });
    alert("Artwork successfully updated!");
    await navigateTo("/admin/artworks");
  } catch (err) {
    console.log("Error updating artwork: " + err);
    alert("Something went wrong! Please try again");
  }
}

async function deleteArtwork() {
  console.log("deleting artwork!");
  isEditing.value = false;

  try {
    await $fetch(`/api/artworks/${artworkId.value}`, {
      method: "DELETE",
    });
    alert("Artwork deleted successfully!");
    navigateTo("/admin/artworks");
  } catch (error) {
    console.log("error deleting artist: " + error);
    alert("Something went wrong. Please try again later!");
  }
}
</script>

<template>
  <div class="verticalContent">
    <div v-if="!isEditing">
      <div v-if="pending">Loading details...</div>
      <div v-if="error">There was an error getting artwork details</div>
      <div v-else-if="artwork">
        <img :src="artwork?.image_path ?? undefined" alt="" class="headShot" />
        <h1>Name: {{ artwork?.title }}</h1>
        <h2>{{ artwork?.description }}</h2>
        <h2>{{ artwork?.price || `$${0}` }}</h2>
        <h2>Available On: {{ artwork?.publish_on }}</h2>
        <!-- <h2>{{ artwork?.artist }}</h2> -->
      </div>
      <Button variant="primary" size="lg" @click="startEdit"
        >Click to Edit Artwork</Button
      >
    </div>
    <div v-if="isEditing" class="verticalContent">
      <label for="title">Title</label>
      <textarea v-model="editedArtwork.title" type="text"></textarea>
      <label for="description">Description</label>
      <textarea v-model="editedArtwork.description" type="text"></textarea>
      <label for="price">Price</label>
      <textarea v-model="editedArtwork.price" type="text"></textarea>
      <label for="image">Artwork</label>
      <input type="file" @change="handleImageChange" />
      <label for="published">Available On:</label>
      <!-- <input type="date" name="published" v-model="editedArtwork.published" /> -->
      <Button variant="primary" size="lg" @click="save">Save Changes</Button>
      <Button variant="secondary" size="lg" @click="stopEdit">Cancel</Button>
    </div>
    <Button variant="danger" size="lg" @click="deleteArtwork"
      >Click to Delete Artwork</Button
    >
  </div>
</template>
