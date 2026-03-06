<template>
  <a
    href="https://www.instagram.com/jamienelsonart?igsh=dnduYjk5amZzeTJ2&utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Instagram class="igIcon clickable" />
  </a>
</template>

<style scoped>
.igIcon {
  width: 12px;
  height: 12px;
  color: var(--text-color);
}

a {
  text-decoration: none;
  color: inherit;
}

@media (min-width: 768px) {
  .igIcon {
    width: 16px;
    height: 16px;
  }
}

@media (min-width: 1024px) {
  .igIcon {
    width: 20px;
    height: 20px;
  }
}
</style>

<script setup>
import Instagram from "~/assets/icons/instagram.svg";
</script>
