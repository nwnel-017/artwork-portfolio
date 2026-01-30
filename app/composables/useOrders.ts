import type { Database } from "#types/supabase/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export function useOrders() {
  const getOrders = () => {
    return useFetch<OrderRow[]>("/api/orders/orders");
  };

  return { getOrders };
}
