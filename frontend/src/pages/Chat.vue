<template>
  <div class="chat-wrapper">
    <!-- Sidebar: Chat history -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Chat History</h3>
        <button @click="startNewChat" class="new-chat-btn">New Chat</button>
      </div>
      <ul>
        <li
          v-for="chatItem in chatsHistory"
          :key="chatItem.id"
          :class="{ active: chatItem.id === activeChatId }"
          @click="loadChat(chatItem.id)"
        >
          {{ getChatTopic(chatItem) }}
        </li>
      </ul>
    </div>

    <!-- Chat area -->
    <div class="chat-container">
      <h2>Fitness Chatbot</h2>

      <div class="messages" ref="messagesContainer">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.sender === 'You' ? 'user' : 'bot']"
        >
          <div class="text">{{ msg.text }}</div>
        </div>
      </div>

      <div class="input-container">
        <input
          v-model="input"
          placeholder="Type your message..."
          class="chat-input"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="submit-btn">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '../services/api.js';

const input = ref('');
const messages = ref([]);
const chatsHistory = ref([]); // All chat threads
const activeChatId = ref(null); // Currently active chat
const messageIdCounter = ref(0);
const messagesContainer = ref(null);

// Load chat history
onMounted(async () => {
  try {
    const res = await api.get('/api/chats'); // JWT-based endpoint
    const grouped = {};
    res.data.forEach(chatItem => {
      if (!grouped[chatItem.id]) grouped[chatItem.id] = [];
      grouped[chatItem.id].push(chatItem);
    });
    chatsHistory.value = Object.keys(grouped).map(id => ({
      id: parseInt(id),
      messages: grouped[id]
    }));

    if (chatsHistory.value.length > 0) {
      loadChat(chatsHistory.value[0].id);
    }
  } catch (err) {
    console.error('Failed to load chat history:', err);
  }
});

// Load specific chat
function loadChat(chatId) {
  const chatThread = chatsHistory.value.find(c => c.id === chatId);
  if (!chatThread) return;

  activeChatId.value = chatId;
  messages.value = [];
  messageIdCounter.value = 0;

  chatThread.messages.forEach(chatItem => {
    messages.value.push({
      id: ++messageIdCounter.value,
      sender: 'You',
      text: chatItem.message
    });
    messages.value.push({
      id: ++messageIdCounter.value,
      sender: 'Bot',
      text: chatItem.response
    });
  });
  scrollToBottom();
}

// Get chat topic (first user message)
function getChatTopic(chatThread) {
  if (!chatThread.messages || chatThread.messages.length === 0) return "New Chat";
  const firstUserMsg = chatThread.messages.find(msg => msg.message);
  if (!firstUserMsg) return "New Chat";
  return firstUserMsg.message.length > 30
    ? firstUserMsg.message.slice(0, 30) + "..."
    : firstUserMsg.message;
}

// Send message
async function sendMessage() {
  const trimmed = input.value.trim();
  if (!trimmed) return;

  messages.value.push({ id: ++messageIdCounter.value, sender: 'You', text: trimmed });
  input.value = '';
  scrollToBottom();

  try {
    const res = await api.post('/api/chatbot', { prompt: trimmed });
    const botMessage = {
      id: ++messageIdCounter.value,
      sender: 'Bot',
      text: res.data.reply
    };
    messages.value.push(botMessage);
    scrollToBottom();

    if (!activeChatId.value) {
      // New chat
      const newChat = {
        id: res.data.chat.id,
        messages: [{ message: trimmed, response: res.data.reply }]
      };
      chatsHistory.value.push(newChat);
      activeChatId.value = newChat.id;
    } else {
      // Append to existing chat
      const chatThread = chatsHistory.value.find(c => c.id === activeChatId.value);
      chatThread.messages.push({ message: trimmed, response: res.data.reply });
    }
  } catch (err) {
    console.error('Chat error:', err);
    messages.value.push({
      id: ++messageIdCounter.value,
      sender: 'Bot',
      text: 'Oops! Something went wrong.'
    });
    scrollToBottom();
  }
}

// Scroll messages
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

// Start a new chat
function startNewChat() {
  messages.value = [];
  messageIdCounter.value = 0;
  activeChatId.value = null;
}
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  height: 600px;
  max-width: 900px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #f3f4f6;
  padding: 10px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.new-chat-btn {
  padding: 2px 6px;
  font-size: 0.8rem;
  border: none;
  border-radius: 5px;
  background-color: #4f46e5;
  color: white;
  cursor: pointer;
}

.new-chat-btn:hover {
  background-color: #4338ca;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 4px;
}

.sidebar li.active {
  background-color: #dbeafe;
}

/* Chat area */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  padding: 10px;
}

h2 {
  text-align: center;
  margin-bottom: 10px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 15px;
  word-wrap: break-word;
}

.message.user {
  background-color: #4f46e5;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 0;
}

.message.bot {
  background-color: #e5e7eb;
  color: #111;
  align-self: flex-start;
  border-bottom-left-radius: 0;
}

.input-container {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  box-sizing: border-box;
}

.submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background-color: #4f46e5;
  color: white;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #4338ca;
}
</style>
