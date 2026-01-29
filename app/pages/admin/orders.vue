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
const showOrderOptions = ref(false);

function changeOrderStatus(id: string) {
  selectedOrder.value = id;
  showOrderOptions.value = true;
}

async function updateOrderStatus(item: string) {
  if (!item) return;

  try {
    await $fetch("/api/orders/status", {
      method: "POST",
      body: {
        orderId: selectedOrder.value,
        status: item,
      },
    });
    alert("Status changed successfully!");
  } catch (err) {
    console.log("Error from backend: " + err);
    alert("Something went wrong!");
  }
}

function cancelStatusChange() {
  selectedOrder.value = null;
  showOrderOptions.value = false;
}

function cancelViewOrder() {
  selectedOrder.value = null;
  showOrderDetails.value = false;
}

function viewOrder(id: string) {
  if (!id) return;
  selectedOrder.value = id;
  showOrderDetails.value = true;
}
</script>

<template>
  <div class="verticalContent">
    <PopupOptions
      v-if="showOrderOptions"
      @cancel="cancelStatusChange"
      @select="updateOrderStatus"
      :items="['PAID', 'SHIPPED', 'DELIVERED']"
    />
    <h1>Orders</h1>
    <div v-if="pending">Loading orders</div>
    <div v-else-if="error">Something went wrong</div>
    <div v-else>
      <div v-if="orders">
        <div class="contentCard">
          <div class="orderGrid">
            <span class="header">Status</span>
            <span class="header">Amount</span>
            <span class="header email">Buyer's Email</span>
            <span class="header">Address</span>
            <span class="header date">Date Created</span>
            <span></span>
            <template
              v-for="order in orders"
              :key="order.id"
              @click="viewOrder(order.id)"
            >
              <span class="clickable">{{ order?.status }}</span>
              <span class="clickable">${{ order?.amount }}</span>
              <span class="email clickable">{{ order?.buyer_email }}</span>
              <span class="cutoffText clickable">{{
                order?.address_line_1
              }}</span>
              <span class="date clickable">{{
                formatDateShort(order?.created_at) ?? ""
              }}</span>
              <Button @click="changeOrderStatus(order.id)"
                >Change Status</Button
              ></template
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orderGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* border: 1px solid var(--text-color); */
  border-radius: 10px;
  padding: 1rem;
  background-color: var(--theme-white);
  gap: 1rem;
  width: 100%;
}

.date {
  display: none;
}

.email {
  display: none;
}

/* h1 {
  font-size: 1em;
} */

@media (min-width: 768px) {
  /* h1 {
    font-size: 2em;
  } */
}

@media (min-width: 1024px) {
  .date {
    display: block;
  }

  .email {
    display: block;
  }

  .orderGrid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
