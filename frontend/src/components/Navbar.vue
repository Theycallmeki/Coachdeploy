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
import api from '../services/api';

const isLoggedIn = ref(false);
const router = useRouter();

// Check login status
const checkAuth = async () => {
  try {
    const res = await api.get('/auth/check');
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
    await api.post('/auth/logout');
    isLoggedIn.value = false;
    router.push('/auth');
  } catch (err) {
    console.error('Logout failed:', err);
  }
};
</script>

<style scoped>
/* Glassmorphic header */
header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

/* Navbar flex layout */
nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

/* Links */
nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
}

nav a:hover {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.5);
}

/* Logout button */
.logout-btn {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: bold;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}
</style>
