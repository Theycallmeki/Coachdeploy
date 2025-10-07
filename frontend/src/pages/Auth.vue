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
          <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
        </form>

        <!-- REGISTER FORM -->
        <form v-else @submit.prevent="registerUser">
          <input v-model="name" type="text" placeholder="Name" required />
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <input v-model.number="bmi" type="number" step="0.1" placeholder="BMI" required />
          <button type="submit" class="submit-btn">Register</button>
          <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
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

// Shared state for messages
const message = ref('');
const success = ref(false);

// LOGIN FORM STATE
const loginEmail = ref('');
const loginPassword = ref('');

// REGISTER FORM STATE
const name = ref('');
const email = ref('');
const password = ref('');
const bmi = ref(null);

// LOGIN METHOD
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

// REGISTER METHOD
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
        isLogin.value = true; // Switch to login after register
        message.value = '';
      }, 2000);
    } else {
      message.value = res.data.message || 'Registration failed.';
      success.value = false;
    }
  } catch (err) {
    console.error('Register error:', err);
    message.value = err.response?.data?.error || 'Server error. Please try again.';
    success.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 20px;
}

.box {
  display: flex;
  flex-direction: column;
}

.toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  background: #e0e0e0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-btn.active {
  background: #667eea;
  color: #fff;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
}

.submit-btn {
  padding: 10px;
  background: #764ba2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
}

.submit-btn:hover {
  background: #667eea;
}

p {
  margin-top: 10px;
  font-weight: bold;
}
</style>
