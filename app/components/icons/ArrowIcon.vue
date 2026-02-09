<script lang="ts" setup>
type Direction = "up" | "down" | "left" | "right";

const props = withDefaults(
  defineProps<{
    direction?: Direction;
    size?: string;
  }>(),
  {
    direction: "right",
    size: "1em",
  },
);

const rotationMap: Record<Direction, string> = {
  right: "180deg",
  down: "90deg",
  left: "0deg",
  up: "-90deg",
};
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
    :style="{
      transform: `rotate(${rotationMap[direction]})`,
      fontSize: size,
    }"
  >
    <path
      d="M4 12H20M4 12L8 8M4 12L8 16"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.icon {
  height: 2rem;
  width: 2rem;
  border: 1px solid var(--text-color);
  border-radius: 5px;
  cursor: pointer;
}
</style>
