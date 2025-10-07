<template>
  <div class="bmi-container">
    <h2>⚖️ Your BMI</h2>

    <!-- BMI Calculator -->
    <form @submit.prevent="calculateBMI" class="bmi-form">
      <input v-model.number="weight" type="number" placeholder="Weight (kg)" required />
      <input v-model.number="height" type="number" placeholder="Height (cm)" required />
      <button type="submit">Calculate BMI</button>
    </form>

    <!-- Display calculated BMI and classification -->
    <div v-if="bmi > 0">
      <p><strong>BMI:</strong> {{ bmi.toFixed(1) }}</p>
      <p><strong>Classification:</strong> {{ classification }}</p>
      <button @click="updateBMI">Update BMI</button>
    </div>

    <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const bmi = ref(0);
const weight = ref(0);
const height = ref(0);
const message = ref("");
const success = ref(false);

// ✅ Calculate BMI from weight (kg) and height (cm)
function calculateBMI() {
  if (weight.value <= 0 || height.value <= 0) {
    message.value = "Enter valid weight and height!";
    success.value = false;
    return;
  }
  const heightMeters = height.value / 100;
  bmi.value = weight.value / (heightMeters * heightMeters);
}

// ✅ BMI Classification
const classification = computed(() => {
  if (bmi.value < 18.5) return "Underweight";
  if (bmi.value < 25) return "Normal weight";
  if (bmi.value < 30) return "Overweight";
  return "Obese";
});

// ✅ Fetch current BMI from backend
async function fetchBMI() {
  try {
    const res = await api.get("/api/bmi");
    if (res.data && res.data.bmi !== undefined) {
      bmi.value = res.data.bmi;
      // Pre-fill weight and height if you want
    }
  } catch (err) {
    console.error(err);
    message.value = "Failed to load BMI.";
  }
}

// ✅ Update BMI in backend
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
.bmi-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.bmi-form input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  padding: 8px 12px;
  margin-top: 5px;
}
</style>
