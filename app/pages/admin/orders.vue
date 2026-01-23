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

// async function editOrder(id: string) {
//   selectedOrder.value = id;
//   showOrderDetails.value = true;
// }

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

function cancelEditOrder() {
  selectedOrder.value = null;
  showOrderDetails.value = false;
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
        <div v-for="order in orders" :key="order.id" class="contentCard">
          <div class="closeHorContent">
            <span>{{ order?.status }}</span>
            <span>${{ order?.amount }}</span>
            <span>{{ order?.buyer_email }}</span>
            <span class="cutoffText">{{ order?.address_line_1 }}</span>
            <span>{{ order?.created_at }}</span>
            <Button variant="secondary" @click="changeOrderStatus(order.id)"
              >Change Status</Button
            >
            <!-- <DropDown label="Change Status" @select="changeOrderStatus" :items="['Shipped', 'Completed']" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
