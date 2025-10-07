<template>
  <div style="max-width:400px; margin:auto; text-align:center;">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <input v-model="name" type="text" placeholder="Name" required /><br />
      <input v-model="email" type="email" placeholder="Email" required /><br />
      <input v-model="password" type="password" placeholder="Password" required /><br />
      <input v-model.number="bmi" type="number" step="0.1" placeholder="BMI" required /><br />

      <button type="submit">Register</button>
    </form>

    <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const bmi = ref(null);
const message = ref('');
const success = ref(false);

async function registerUser() {
  try {
    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ important if cookies are set in backend
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
        bmi: Number(bmi.value),
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      message.value = data.message || 'Registered successfully!';
      success.value = true;

      // Optional redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      message.value = data.message || data.error || 'Registration failed.';
      success.value = false;
    }
  } catch (err) {
    console.error('Register error:', err);
    message.value = 'Server error. Please try again.';
    success.value = false;
  }
}
</script>
