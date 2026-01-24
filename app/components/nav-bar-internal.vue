<script lang="ts" setup>
const isOpen = ref(false);

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div>
    <div @click="toggleNav" class="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="navBarInternal" :class="{ open: isOpen }">
      <button @click="toggleNav" class="exitBtn">x</button>
      <NuxtLink to="/admin/dashboard" class="dashLink">Dashboard</NuxtLink>
      <NuxtLink to="/admin/orders" class="dashLink">Orders</NuxtLink>
      <NuxtLink to="/admin/artworks" class="dashLink">Artworks</NuxtLink>
      <NuxtLink to="/admin/settings" class="dashLink">Settings</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.navBarInternal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  gap: 1.5rem;
  height: 100vh;
  width: 40vw;
  left: 0;
  padding-left: 1rem;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.navBarInternal.open {
  transform: translateX(0);
}

.dashLink {
  text-decoration: none;
  font-weight: bold;
  color: var(--text-color);
}

.hamburger {
  width: 25px;
  cursor: pointer;
  position: fixed;
  top: 1rem;
  left: 1rem;
}

.hamburger span {
  display: block;
  height: 1px;
  margin: 5px 0;
  /* background-color: var(--text-color); */
  background: var(--text-color);
  border-radius: 1px;
}

.exitBtn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .navBarInternal {
    width: 20vw;
    padding-left: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .navBarInternal {
    width: 15vw;
    padding-left: 2rem;
  }
}
</style>
