<script setup lang="ts">
import InstagramIcon from "~/components/icons/InstagramIcon.vue";

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="verticalContent center fillPage fillVertical">
    <h1>Comissions</h1>
    <div class="centerText">
      Working on commissions is always exciting because we get to bring your
      vision to life together. Feel free to reach out with any ideas or
      questions you have about a commission. I’m really looking forward to your
      ideas!
    </div>
    <h4>Email: jamiestambolie@gmail.com</h4>
    <div><InstagramIcon size="lg" /></div>
  </div>
</template>

<style scoped>
.centerText {
  max-width: 90%;
  text-align: center;
}

.fillVertical {
  min-height: 70dvh;
}

.center {
  justify-content: center;
}

.contactTxt {
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .centerText {
    max-width: 50%;
  }
}

@media (min-width: 1024px) {
  .centerText {
    max-width: 30%;
  }
}
</style>
