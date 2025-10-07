<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const message = ref("");
const success = ref(false);
const router = useRouter();

async function loginUser() {
  try {
    const res = await api.post("/auth/login", { email: email.value, password: password.value });
    message.value = res.data.message || "Login successful!";
    success.value = true;

    // Redirect to homepage after login
    setTimeout(() => router.push("/"), 1000);
  } catch (err) {
    message.value = err.response?.data?.error || "Login failed.";
    success.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
.login-container input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
.login-container button {
  padding: 8px 16px;
}
</style>
