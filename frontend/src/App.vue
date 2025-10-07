<template>
  <div style="text-align:center; margin-top:50px;">
    <h1>User Goals</h1>
    <ul v-if="goals.length">
      <li v-for="goal in goals" :key="goal.id">
        <strong>{{ goal.name }}</strong>: {{ goal.description }}
      </li>
    </ul>
    <p v-else>Loading or no goals found...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const goals = ref([]);
const userId = 4; // Replace with the userId you want to fetch

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/goals/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    const data = await res.json();
    goals.value = data;
  } catch (err) {
    console.error(err);
    goals.value = [];
  }
});
</script>
