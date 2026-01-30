<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { getStats } = useDashboard();
const { getArtworks } = useArtworks();
const { getOrders } = useOrders();

const { data: stats, pending, error } = await getStats();
const { data: artworks } = await getArtworks();
const { data: orders } = await getOrders();
</script>

<template>
  <div>
    <section>
      <div><h3>Dashboard Overview</h3></div>
      <div class="verticalContent">
        <div>
          <div v-if="pending">Loading...</div>
          <div v-if="error">Something Went Wrong</div>
          <div v-else class="dashPanel">
            <div class="panel">
              <div class="statCard">
                <span>{{ stats?.artworks }}</span
                >Artworks
              </div>
            </div>
            <div class="panel">
              <div class="statCard">
                <span>{{ formatFunds(stats?.fundsRaised || 0) }}</span
                >Raised
              </div>
            </div>
            <div class="panel">
              <div class="statCard">
                <span>{{ stats?.orders }}</span
                >Orders
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div><h3>Recent Activity</h3></div>
      <div
        v-if="artworks && artworks.length > 0"
        class="recentArtworks"
        @click="navigateTo('/admin/artworks')"
      >
        <div
          v-for="artwork in artworks.slice(0, 2)"
          :key="artwork?.id"
          class="artworkCard"
        >
          <div class="dashArtworkContainer">
            <img
              :src="artwork?.image_path ?? undefined"
              :alt="artwork?.title ?? 'Artwork'"
              class="cardImage"
            />
          </div>
          <p class="cutoffText">{{ artwork?.title }}</p>
        </div>
      </div>
      <div v-else class="noArtworks">No artworks yet</div>
      <!-- </div> -->
    </section>
    <div><h3>Recent Orders</h3></div>
    <section>
      <!-- <div class="verticalContent"> -->
      <div
        v-if="orders && orders.length > 0"
        class="recentArtworks"
        @click="navigateTo('/admin/orders')"
      >
        <div
          v-for="order in orders.slice(0, 2)"
          :key="order?.id"
          class="artworkCard"
        >
          <p class="cutoffText">${{ order?.amount }}</p>
          <p class="cutoffText">{{ order?.status }}</p>
        </div>
      </div>
      <div v-else class="noArtworks">No orders yet</div>
      <!-- </div> -->
    </section>
  </div>
</template>

<style scoped>
section {
  /* border: 1px solid var(--text-color); */
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.recentArtworks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashOverview {
  display: flex;
  flex-direction: column;
  height: 20vh;
  padding: 0;
  border: 1px solid var(--text-color);
}

.dashPanel {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 8px;
  /* min-height: 50vh; */
}

.panel {
  width: 5rem;
  height: 5rem;
  border: 1px solid var(--theme-grey);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.panel span {
  font-size: 0.9rem;
  font-weight: bold;
}

.statCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  align-items: left;
  /* background-color: #ffffff; */
}

.artworkCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--text-color);
  border-radius: 8px;
  padding: 0 0.5rem;
  cursor: pointer;
}

.dashArtworkContainer {
  width: 50px;
  height: 50px;
  border: 1px solid var(--theme-grey);
  background-color: black;
  border-radius: 8px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
