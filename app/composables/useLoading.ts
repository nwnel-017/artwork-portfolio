const loadingCount = ref(0);

export const useLoading = () => {
  // const counter = useState<number>("global-loading-counter", () => 0);

  const isLoading = computed(() => loadingCount.value > 0);

  const startLoading = () => {
    console.log("starting loading");
    loadingCount.value++;
  };
  const stopLoading = () => {
    console.log("loading stopped");
    if (loadingCount.value > 0) loadingCount.value--;
  };

  return { isLoading, loadingCount, startLoading, stopLoading };
};
