<script lang="ts" setup>
import type { DropDown } from "#types/dropdown/dropdown";

defineProps<{ label: string; items: DropDown[] }>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const closeOptions = () => {
  isOpen.value = false;
};

const emit = defineEmits<{ (e: "select", item: DropDown): void }>();

const selectItem = (item: DropDown) => {
  emit("select", item);
  closeOptions();
};
</script>

<template>
  <div class="dropdown" @click.outside.self="closeOptions">
    <Button @click.stop="toggle">{{ label }}</Button>
    <ul v-if="isOpen" class="dropdownOptions">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="dropdownItem"
        @click="selectItem(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  cursor: pointer;
}

.dropdownOptions {
  background-color: var(--text-blue);
  top: 0;
  margin: 0 auto;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.dropdownItem {
  text-decoration: none;
  list-style: none;
}
</style>
