<template>
  <div class="bmi-container">
    <h2>⚖️ Your BMI</h2>

    <!-- BMI Calculator -->
    <form @submit.prevent="calculateBMI" class="bmi-form">
      <input v-model.number="weight" type="number" placeholder="Weight (kg)" required />
      <input v-model.number="height" type="number" placeholder="Height (cm)" required />
      <button type="submit" class="submit-btn">BMI INFO</button>
    </form>

    <!-- Display calculated BMI and classification -->
    <div v-if="bmi !== null" class="bmi-result">
      <p><strong>BMI:</strong> {{ bmi.toFixed(1) }}</p>
      <p><strong>Classification:</strong> {{ classification }}</p>
      <button @click="updateBMI" class="submit-btn">Update BMI</button>
    </div>

    <p v-if="message" :class="success ? 'success-msg' : 'error-msg'">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const bmi = ref(null);
const weight = ref(null);
const height = ref(null);
const message = ref("");
const success = ref(false);

function calculateBMI() {
  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    message.value = "Enter valid weight and height!";
    success.value = false;
    return;
  }
  const heightMeters = height.value / 100;
  bmi.value = weight.value / (heightMeters * heightMeters);
  message.value = "";
}

const classification = computed(() => {
  if (bmi.value === null) return "";
  if (bmi.value < 18.5) return "Underweight";
  if (bmi.value < 25) return "Normal weight";
  if (bmi.value < 30) return "Overweight";
  return "Obese";
});

async function fetchBMI() {
  try {
    const res = await api.get("/api/bmi");
    if (res.data && res.data.bmi !== undefined && res.data.bmi !== null) {
      bmi.value = res.data.bmi;
    }
  } catch (err) {
    console.error(err);
    message.value = "Failed to load BMI.";
  }
}

async function updateBMI() {
  try {
    await api.patch("/api/bmi", { bmi: bmi.value });
    message.value = "BMI updated successfully!";
    success.value = true;
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.error || "Failed to update BMI.";
    success.value = false;
  }
}

onMounted(fetchBMI);
</script>

<style scoped>
/* Container */
.bmi-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 25px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
}

/* Headings */
h2 {
  margin-bottom: 20px;
}

/* BMI form inputs */
.bmi-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.bmi-form input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Submit buttons */
.submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 5px;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}

/* BMI result */
.bmi-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

/* Feedback messages */
.success-msg {
  color: #00ff9d;
  margin-top: 10px;
}

.error-msg {
  color: #ff4d6d;
  margin-top: 10px;
}
</style>
