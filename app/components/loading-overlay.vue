<script lang="ts" setup>
const { isLoading } = useLoading();
</script>

<template>
  <div v-if="isLoading" class="overlay">
    <Lottie name="loader" class="loader" />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4); /* semi-transparent */
  z-index: 1000;
}

.loader {
  width: 300px;
  height: 150px;
}
</style>
