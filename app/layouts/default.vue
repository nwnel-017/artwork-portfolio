<script setup lang="ts"></script>

<template>
  <div class="verticalContent fillPage">
    <div class="page spaceBetween">
      <div>
        <NavBar />
        <div class="centerContent">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<style></style>
