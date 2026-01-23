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
    <h1>Welcome</h1>
    <div class="dashPanel">
      <div v-if="pending">Loading...</div>
      <div v-if="error">Something Went Wrong</div>
      <div v-else>
        <div class="panels">Total Artworks: {{ stats?.artworks }}</div>
        <div class="panels">Sold Artworks: {{ stats?.soldArtworks }}</div>
        <div class="panels">Orders: {{ stats?.orders }}</div>
        <div class="panels">Funds Raised: ${{ stats?.fundsRaised }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashPanel {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  /* border: 2px solid black; */
  gap: 1rem;
}

.panels {
  width: 25%;
}
</style>
