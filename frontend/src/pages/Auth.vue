<template>
  <div class="container">
    <div class="box">
      <div class="toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: isLogin }" 
          @click="isLogin = true"
        >
          Login
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: !isLogin }" 
          @click="isLogin = false"
        >
          Register
        </button>
      </div>

      <div class="form-wrapper">
        <!-- LOGIN FORM -->
        <form v-if="isLogin" @submit.prevent="loginUser">
          <input v-model="loginEmail" type="email" placeholder="Email" required />
          <input v-model="loginPassword" type="password" placeholder="Password" required />
          <button type="submit" class="submit-btn">Login</button>
          <p v-if="message" :style="{ color: success ? '#00ff9d' : '#ff4d6d' }">{{ message }}</p>
        </form>

        <!-- REGISTER FORM -->
        <form v-else @submit.prevent="registerUser">
          <input v-model="name" type="text" placeholder="Name" required />
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <input v-model.number="bmi" type="number" step="0.1" placeholder="BMI" required />
          <button type="submit" class="submit-btn">Register</button>
          <p v-if="message" :style="{ color: success ? '#00ff9d' : '#ff4d6d' }">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const isLogin = ref(true);
const router = useRouter();
const message = ref('');
const success = ref(false);

const loginEmail = ref('');
const loginPassword = ref('');

const name = ref('');
const email = ref('');
const password = ref('');
const bmi = ref(null);

async function loginUser() {
  try {
    const res = await api.post('/auth/login', { email: loginEmail.value, password: loginPassword.value });
    message.value = res.data.message || 'Login successful!';
    success.value = true;
    setTimeout(() => router.push('/'), 1000);
  } catch (err) {
    message.value = err.response?.data?.error || 'Login failed.';
    success.value = false;
  }
}

async function registerUser() {
  try {
    const res = await api.post('/auth/register', {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      bmi: Number(bmi.value),
    });

    if (res.data.success) {
      message.value = res.data.message || 'Registered successfully!';
      success.value = true;

      setTimeout(() => {
        isLogin.value = true;
        message.value = '';
      }, 2000);
    } else {
      message.value = res.data.message || 'Registration failed.';
      success.value = false;
    }
  } catch (err) {
    message.value = err.response?.data?.error || 'Server error. Please try again.';
    success.value = false;
  }
}
</script>

<style scoped>
/* Page Background */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  animation: bgAnimation 20s ease infinite;
}

/* Background gradient animation */
@keyframes bgAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Glassmorphic card */
.box {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 30px;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

/* Toggle buttons */
.toggle {
  display: flex;
  margin-bottom: 25px;
  gap: 10px;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.5);
}

/* Form styling */
.form-wrapper {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

input {
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.submit-btn {
  padding: 12px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}

p {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
