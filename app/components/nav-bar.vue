<script lang="ts" setup>
import { ref } from "vue";

const isOpen = ref(false);

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div>
    <div class="navBar">
      <div class="navHeader">JAMIE NELSON ART</div>
      <div
        @click="toggleNav"
        class="hamburger"
        :class="{ open: isOpen }"
        role="button"
        :aria-expanded="isOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="linkItems" :class="{ expanded: isOpen }">
      <div class="verticalSpaced">
        <NuxtLink to="/" class="dashLink">HOME</NuxtLink>
        <NuxtLink to="/artworks/gallery" class="dashLink"
          >AVAILABLE ARTWORKS</NuxtLink
        >
        <NuxtLink to="/artworks/gallery" class="dashLink">PORTFOLIO</NuxtLink>
        <NuxtLink to="/about" class="dashLink">ABOUT THE ARTIST</NuxtLink>
        <NuxtLink to="/contact" class="dashLink">CONTACT</NuxtLink>
      </div>
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
  height: 5rem;
  padding: 0 1rem;
  background-color: var(--theme-off-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.linkItems {
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding-top: 5rem; */
  /* gap: 1rem; */
  transform: translateY(-200%);
  transition: transform 0.3s ease-in-out;
  background-color: white;
  border-radius: 8px;
  z-index: 999;
  width: 50%;
  min-height: 70vh;
  padding: 2rem;
}

.linkItems.expanded {
  transform: translateY(0);
}

.dashLink {
  text-decoration: none;
  color: var(--text-color);
}

.verticalSpaced {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hamburger {
  width: 25px;
  cursor: pointer;
  top: 1rem;
  left: 1rem;
  /* position: fixed;
  right: 0; */
  z-index: 1000;
}

.hamburger span {
  display: block;
  height: 1px;
  background: var(--text-color);
  border-radius: 2px;
  transform-origin: center;
  transition:
    transform 0.2s ease,
    opacity 0.25s ease;
}

/* Position the bars */
.hamburger span:nth-child(1) {
  transform: translateY(-8px);
}

.hamburger span:nth-child(2) {
  transform: translateY(0);
}

.hamburger span:nth-child(3) {
  transform: translateY(8px);
}

/* OPEN STATE */
.hamburger.open span:nth-child(1) {
  transform: translateY(0) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(0) rotate(-45deg);
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
