<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import type { Order } from "@stripe/stripe-js";
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

const {
  data: orders,
  pending,
  error,
} = await useFetch<OrderRow[]>("/api/orders/orders");

const selectedOrder = ref<any | null>(null);
const showOrderDetails = ref(false);

async function editOrder(id: string) {
  selectedOrder.value = id;
  showOrderDetails.value = true;
}

async function cancelEditOrder() {
  selectedOrder.value = null;
  showOrderDetails.value = false;
}
</script>

<template>
  <div class="verticalContent">
    <h1>Orders</h1>
    <div v-if="pending">Loading orders</div>
    <div v-else-if="error">Something went wrong</div>
    <div v-else>
      <div v-if="orders">
        <div v-for="order in orders" :key="order.id" class="contentCard">
          <div class="closeHorContent">
            <span>{{ order?.status }}</span>
            <span>${{ order?.amount }}</span>
            <span>{{ order?.buyer_email }}</span>
            <span class="cutoffText">{{ order?.address_line_1 }}</span>
            <span>{{ order?.created_at }}</span>
            <Button variant="secondary" @click="editOrder(order.id)"
              >Edit</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
