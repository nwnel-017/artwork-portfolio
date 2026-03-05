<template>
  <a
    href="https://www.instagram.com/accounts/login/?next=%2F_jamie_nelson_%2F&source=omni_redirect"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Instagram class="igIcon clickable" />
  </a>
</template>

<style scoped>
.igIcon {
  width: 14px;
  height: 14px;
}

.igIcon :deep(svg) {
  width: 100%;
  height: 100%;
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
