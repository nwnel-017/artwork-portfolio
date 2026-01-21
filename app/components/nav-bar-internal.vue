<template>
  <div class="navBarInternal">
    <NuxtLink to="/admin/dashboard" class="dashLink">Dashboard</NuxtLink>
    <NuxtLink to="/admin/orders" class="dashLink">Orders</NuxtLink>
    <NuxtLink to="/admin/artworks" class="dashLink">Artworks</NuxtLink>
    <NuxtLink to="/admin/settings" class="dashLink">Settings</NuxtLink>
  </div>
</template>

<style scoped>
  
.navBarInternal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid black;
  gap: 1.5rem;
  height: 100vh;
  width: 10vw;
  left: 0;
  padding-left: 1rem;
  background-color: var(--theme-off-white);
}

.dashLink {
  text-decoration: none;
  font-weight: bold;
  color: var(--text-color);
}
</style>
