<script lang="ts" setup>
import type { Collection } from "#types/collections/collection";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

// const collection = reactive<Collection>({
//   title: "",
// });

const newCollection = ref("");

async function submit() {
  if (!newCollection.value) {
    alert("Please enter a valid value!");
  }

  const collectionName = newCollection.value;

  const res = await $fetch("/api/collections/collection", {
    method: "POST",
    body: { name: collectionName },
  });

  alert(res.message);

  await navigateTo("/admin/collections/collections");
}
</script>

<template>
  <div class="spaced vertical">
    <h1>Add Collection</h1>
    <div class="spaced">
      <label for="title">New Collection:</label>
      <input type="text" v-model="newCollection" />
    </div>
    <Button class="buttonCol" @click="submit">Submit</Button>
  </div>
</template>
