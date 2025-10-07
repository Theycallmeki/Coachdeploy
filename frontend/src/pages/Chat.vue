<template>
  <div style="max-width:500px; margin:auto;">
    <h2>Chat</h2>
    <div v-for="msg in messages" :key="msg.id">{{ msg }}</div>
    <input v-model="input" @keyup.enter="sendMessage" placeholder="Type message..." />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const input = ref('');
const messages = ref([]);

function sendMessage() {
  if (!input.value.trim()) return;
  messages.value.push(`You: ${input.value}`);
  messages.value.push(`Bot: Got it!`);
  input.value = '';
}
</script>
