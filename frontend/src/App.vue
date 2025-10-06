<template>
  <div style="text-align:center; margin-top:50px;">
    <h1>{{ message || "Loading..." }}</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const message = ref("");

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3001/api/message");
    const data = await res.json();
    message.value = data.message;
  } catch {
    message.value = "Error connecting to backend";
  }
});
</script>
