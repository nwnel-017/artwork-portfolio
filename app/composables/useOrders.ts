import type { OrderRow } from "~~/types/supabase/tables";

export function useOrders() {
  const getOrders = () => {
    return useFetch<OrderRow[]>("/api/orders/orders");
  };

  return { getOrders };
}
