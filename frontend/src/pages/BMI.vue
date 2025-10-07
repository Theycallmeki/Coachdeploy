<template>
  <div style="text-align:center;">
    <h2>BMI Calculator</h2>
    <input v-model.number="weight" placeholder="Weight (kg)" />
    <input v-model.number="height" placeholder="Height (m)" />
    <button @click="calculateBMI">Calculate</button>
    <p v-if="bmi">Your BMI: {{ bmi.toFixed(2) }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const weight = ref(null);
const height = ref(null);
const bmi = ref(null);

function calculateBMI() {
  if (weight.value && height.value) {
    bmi.value = weight.value / (height.value * height.value);
  }
}
</script>
