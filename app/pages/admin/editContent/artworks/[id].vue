<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"]; // look for cleaner way later;
type EditedArtwork = {
  id: string;
  title: string;
  description: string;
  dimensions: string;
  price: string;
  image: File | null;
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
  dimensions: "",
  price: "",
  image: null,
});

const isEditing = ref(false);

function startEdit() {
  isEditing.value = true;
  editedArtwork.value = {
    id: artworkId.value,
    title: artwork.value?.title || "",
    description: artwork.value?.description || "",
    dimensions: artwork.value?.dimensions || "",
    price: artwork.value?.price?.toString() || "",
    image: null,
  };
}

function stopEdit() {
  isEditing.value = false;
  editedArtwork.value = {
    id: "",
    title: "",
    description: "",
    dimensions: "",
    price: "",
    image: null,
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
  const newDimensions = editedArtwork.value.dimensions;
  const newImage = editedArtwork.value.image;

  if (!newTitle || !newDesc || !newPrice || !newImage || !newDimensions) {
    console.log("new title: " + newTitle);
    console.log("new desc: " + newDesc);
    console.log("new price: " + newPrice);
    console.log("new dimensions: " + newDimensions);
    return;
  }

  if (
    newTitle === artwork.value?.title &&
    newDesc === artwork.value?.description &&
    newPrice === artwork.value?.price?.toString() &&
    newDimensions === artwork.value?.dimensions
  ) {
    alert("No changes have been made!");
    return;
  }

  const form = new FormData();
  form.append("id", artworkId.value);
  form.append("title", newTitle);
  form.append("description", newDesc);
  form.append("dimensions", newDimensions);
  form.append("price", newPrice);
  form.append("image", newImage);

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
        <div class="imgContainer">
          <img
            :src="artwork?.image_path ?? undefined"
            alt=""
            class="artworkFull"
          />
        </div>
        <div class="artworkDetails">
          <div><span>Title:</span> {{ artwork?.title }}</div>
          <div><span>Description:</span> {{ artwork?.description }}</div>
          <div><span>Dimensions:</span> {{ artwork?.dimensions }}</div>
          <div><span>Price:</span> ${{ artwork?.price || `$${0}` }}</div>
        </div>
      </div>
      <div class="btnContainer">
        <Button variant="primary" size="lg" class="btn" @click="startEdit"
          >Click to Edit Artwork</Button
        >
        <Button
          variant="primary"
          size="lg"
          class="btn"
          @click="navigateTo('/admin/editContent/gallery/' + artwork?.id)"
          >Click to Edit Gallery</Button
        >
        <Button variant="danger" size="lg" @click="deleteArtwork" class="btn"
          >Click to Delete Artwork</Button
        >
      </div>
    </div>
    <div v-if="isEditing" class="verticalContent spaced">
      <label for="title">Title</label>
      <textarea v-model="editedArtwork.title" type="text"></textarea>
      <label for="description">Description</label>
      <textarea v-model="editedArtwork.description" type="text"></textarea>
      <label for="price">Price</label>
      <textarea v-model="editedArtwork.price" type="text"></textarea>
      <label for="dimensions">Size:</label>
      <textarea v-model="editedArtwork.dimensions" type="text"></textarea>
      <label for="image">Artwork</label>
      <input
        type="file"
        id="fileInput"
        class="hiddenInput"
        @change="handleImageChange"
      />
      <label for="fileInput" class="fileInput">{{
        editedArtwork.image?.name || "Change image"
      }}</label>
      <Button variant="primary" size="lg" @click="save">Save Changes</Button>
      <Button variant="secondary" size="lg" @click="stopEdit">Cancel</Button>
    </div>
  </div>
</template>

<style scoped>
.btn {
  min-width: 170px;
}

.btnContainer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hiddenInput {
  display: none;
}

.fileInput {
  cursor: pointer;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--theme-blue);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  max-height: 2rem;
  border-radius: 6px;
  width: 170px;
  color: white;
}

.fileInput:hover {
  background: #2563eb;
  opacity: 0.9;
}

.imgContainer {
  max-width: 400px;
  max-height: 400px;
}

.artworkFull {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.artworkDetails {
  padding: 0.5rem 0;
  height: auto;
  margin: 0.5rem 0;
}

.artworkDetails span {
  font-weight: bold;
}

textarea {
  border-radius: 8px;
  border-color: var(--text-color);
  width: 90%;
  font-family: inherit;
}

@media (min-width: 768px) {
  .btnContainer {
    flex-direction: row;
    justify-content: space-around;
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  textarea {
    width: 25vw;
    height: 5rem;
  }

  .btn {
    width: 200px;
  }

  .fileInput {
    width: 200px;
  }
}
</style>
