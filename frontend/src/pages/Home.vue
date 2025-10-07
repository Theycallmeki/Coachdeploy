<template>
  <div class="homepage">
    <!-- Background overlay -->
    <div class="background-overlay"></div>

    <!-- Welcome section -->
    <div class="welcome-card">
      <h1 v-if="user">Welcome, {{ user.name }}!</h1>
      <h1 v-else>Welcome to AI Fitness Coach!</h1>
      <p>Track your BMI, set goals, and chat with your AI fitness coach.</p>
    </div>

    <!-- Quick links -->
    <div class="quick-links" v-if="user">
      <router-link to="/bmi" class="link-card">⚖️ BMI Calculator</router-link>
      <router-link to="/goals" class="link-card">🎯 My Goals</router-link>
      <router-link to="/chat" class="link-card">💬 Chat with Coach</router-link>
    </div>

    <!-- Logged-out info -->
    <div v-else class="guest-info">
      <p>Please <router-link to="/auth">Sign In / Sign Up</router-link> to start your fitness journey!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const user = ref(null);

onMounted(async () => {
  try {
    const res = await api.get("/auth/check");
    user.value = res.data.user;
  } catch (err) {
    user.value = null;
  }
});
</script>

<style scoped>
/* Full-screen gradient background */
.homepage {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 80px;
  color: #fff;
  font-family: 'Arial', sans-serif;
  overflow-x: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00d4ff, #00ff9d);
  z-index: -2;
}

.background-overlay::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,0,0,0.2), transparent 70%);
  top: 0;
  left: 0;
  z-index: -1;
}

/* Welcome card */
.welcome-card {
  text-align: center;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  max-width: 600px;
  animation: fadeIn 1.2s ease-in-out;
}

.welcome-card h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #00ff9d, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-card p {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
}

/* Quick links */
.quick-links {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.link-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 120px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(15px);
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.link-card:hover {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0,255,157,0.5);
}

/* Guest info */
.guest-info {
  margin-top: 40px;
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
}

.guest-info a {
  color: #00ff9d;
  text-decoration: underline;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
