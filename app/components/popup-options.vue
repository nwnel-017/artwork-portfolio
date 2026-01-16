<script lang="ts" setup>
const props = defineProps<{
  items: string[];
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "select", value: string): void;
}>();

function selectItem(item: string) {
  emit("select", item);
}
</script>

<template>
  <div>
    <h1>New Order Status</h1>
    <div class="verticalContent">
      <Button
        v-for="item in items"
        :key="item"
        @click="selectItem(item)"
        variant="secondary"
        >{{ item }}</Button
      >
    </div>
    <Button @click="emit('cancel')" variant="danger">Cancel</Button>
  </div>
</template>
