<template>
  <div class="navBar">
    <div class="navHeader">Jamie Nelson</div>
    <div class="linkItems">
      <NuxtLink to="/" class="dashLink">Home </NuxtLink>
      <NuxtLink to="/artworks/gallery" class="dashLink">Gallery</NuxtLink>
      <NuxtLink to="/about" class="dashLink">About</NuxtLink>
      <NuxtLink to="/contact" class="dashLink">Contact</NuxtLink>
    </div>
  </div>
</template>

<style>
.navHeader {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.navBar {
  width: 100%;
  padding: 0 1rem;
  background-color: var(--theme-off-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.linkItems {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.dashLink {
  text-decoration: none;
  color: var(--text-color);
}

@media (min-width: 768px) {
  .navBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .linkItems {
    width: auto;
    gap: 2rem;
  }
}
</style>
