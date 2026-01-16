<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { getStats } = useDashboard();

const { data: stats, pending, error } = await getStats();
</script>

<template>
  <div class="verticalContent">
    <h1>Hello Jamie</h1>
    <div class="dashPanel">
      <div v-if="pending">Loading...</div>
      <div v-else>
        <div class="panels">Artworks: {{ stats?.artworks }}</div>
        <div class="panels">Orders: {{ stats?.orders }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashPanel {
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
}

.panels {
  width: 25%;
}
</style>
