<template>
  <div>
    <h3>Chatbot</h3>
    <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
    <input v-model="input" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      if (this.input.trim()) {
        this.messages.push("You: " + this.input);
        this.messages.push("Bot: Hello! I received your message.");
        this.input = '';
      }
    },
  },
};
</script>
