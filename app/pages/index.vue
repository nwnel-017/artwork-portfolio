<script lang="ts" setup>
definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="verticalContent fullWidth">
    <div class="landingPad">
      <h1>Welcome</h1>
      <div>Bringing art to life</div>
      <Button @click="navigateTo('/artworks/gallery')">View Gallery</Button>
      <div class="imageContainer"></div>
      <Button variant="secondary" @click="navigateTo('/about')"
        >About the Artist</Button
      >
      <img src="" alt="" />
    </div>
  </div>
</template>

<style scoped>
.landingPad {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.landingPad h1 {
  margin: 0;
}

.imageContainer {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
