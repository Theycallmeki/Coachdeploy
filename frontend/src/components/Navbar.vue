<template>
  <header>
    <nav>
      <!-- Always visible -->
      <router-link to="/">Home</router-link>

      <!-- Show only if NOT logged in -->
      <router-link v-if="!isLoggedIn" to="/auth">Sign In / Sign Up</router-link>

      <!-- Show only if logged in -->
      <router-link v-if="isLoggedIn" to="/bmi">BMI Calculator</router-link>
      <router-link v-if="isLoggedIn" to="/goals">Goals</router-link>
      <router-link v-if="isLoggedIn" to="/chat">Chat</router-link>

      <!-- Logout button only when logged in -->
      <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
        Log Out
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; // ✅ use api.js

const isLoggedIn = ref(false);
const router = useRouter();

// Check login status from backend
const checkAuth = async () => {
  try {
    const res = await api.get('/auth/check'); // ✅ use api.js
    isLoggedIn.value = res.data.loggedIn;
  } catch (err) {
    console.error('Auth check failed:', err);
    isLoggedIn.value = false;
  }
};

onMounted(() => {
  checkAuth();
});

// Logout handler
const handleLogout = async () => {
  try {
    await api.post('/auth/logout'); // ✅ use api.js
    isLoggedIn.value = false;
    router.push('/auth'); // redirect to auth page after logout
  } catch (err) {
    console.error('Logout failed:', err);
  }
};
</script>

<style scoped>
header {
  background-color: #4caf50;
  padding: 1rem;
  color: white;
  text-align: center;
}

nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

nav a:hover {
  color: #dfffd8;
}

.logout-btn {
  background: none;
  border: 1px solid white;
  color: white;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  background-color: white;
  color: #4caf50;
}
</style>
