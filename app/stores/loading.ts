// stores/loading.ts
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const counter = ref(0);

  function startLoading() {
    counter.value++;
  }

  function stopLoading() {
    if (counter.value > 0) counter.value--;
  }

  const isLoading = computed(() => counter.value > 0);

  return { counter, isLoading, startLoading, stopLoading };
});
