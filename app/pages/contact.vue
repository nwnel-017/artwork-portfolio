<script lang="ts" setup>
import InstagramIcon from "~/components/icons/InstagramIcon.vue";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Contact",
  description:
    "Get in touch with Jamie Nelson for artwork questions, purchase inquiries, and general contact information.",
  ogTitle: "Contact Jamie Nelson Art",
  ogDescription:
    "Get in touch with Jamie Nelson for artwork questions, purchase inquiries, and general contact information.",
});
</script>

<template>
  <div class="verticalContent center fillPage fillVertical">
    <h4>Email: jamiestambolie@gmail.com</h4>
    <div><InstagramIcon size="lg" /></div>
  </div>
</template>

<style scoped>
.fillVertical {
  min-height: 70dvh;
}

.center {
  justify-content: center;
}

.contactTxt {
  font-size: 1.25rem;
}
</style>
