<script lang="ts" setup>
import ArrowIcon from "./icons/ArrowIcon.vue";

const props = withDefaults(
  defineProps<{
    direction?: "up" | "down" | "left" | "right";
    size?: string;
    disabled?: boolean;
  }>(),
  {
    direction: "right",
    size: "1rem",
    disabled: false,
  },
);
</script>

<template>
  <div>
    <ArrowIcon :direction="direction" :size="size" />
  </div>
</template>
