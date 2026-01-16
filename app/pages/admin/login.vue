<script lang="ts" setup>
import { ref } from "vue";

definePageMeta({
  layout: false,
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const email = ref("");
const password = ref("");

const login = async () => {
  console.log("logging in!");
  if (!email.value.trim() || !password.value.trim()) return;

  // should be refreshing the jwt?
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    console.log(error.message);
    return;
  }

  email.value = "";
  password.value = "";

  watch(
    user,
    (u) => {
      if (u) {
        navigateTo("/admin/dashboard");
      }
    },
    { once: true }
  );

  // await navigateTo("/admin/dashboard"); // client side routing - maybe change to navigateTo?
};
</script>

<template>
  <div class="page centerContent">
    <div class="verticalContent">
      <h1>Login</h1>
      <form class="submissionForm" @submit.prevent="login">
        <input v-model="email" name="email" placeholder="Email" />
        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Password"
        />
        <Button type="submit" size="sm">Login</Button>
      </form>
    </div>
  </div>
</template>

<style></style>
