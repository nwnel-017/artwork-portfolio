<template>
  <div class="navBar">
    <NuxtLink to="/" class="dashLink">Home </NuxtLink>
    <NuxtLink to="/artworks/gallery" class="dashLink">Gallery</NuxtLink>
  </div>
</template>

<style>
.navBar {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: var(--theme-off-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashLink {
  text-decoration: none;
  font-weight: bold;
  color: var(--text-color);
}
</style>
