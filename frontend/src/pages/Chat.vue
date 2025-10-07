<template>
  <div class="chat-wrapper">
    <!-- Sidebar: Chat history -->
    <div :class="['sidebar', { collapsed: isCollapsed }]">
      <div class="sidebar-header">
        <h3 v-if="!isCollapsed">Chat History</h3>
        <button @click="toggleSidebar" class="collapse-btn">
          {{ isCollapsed ? '▶' : '◀' }}
        </button>
        <button @click="startNewChat" class="new-chat-btn" v-if="!isCollapsed">New Chat</button>
      </div>
      <ul v-if="!isCollapsed">
        <li
          v-for="chatItem in chatsHistory"
          :key="chatItem.id"
          :class="{ active: chatItem.id === activeChatId }"
        >
          <span @click="loadChat(chatItem.id)" class="chat-title">
            {{ getChatTopic(chatItem) }}
          </span>
          <button class="delete-chat-btn" @click.stop="deleteChat(chatItem.id)">🗑️</button>
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
const chatsHistory = ref([]);
const activeChatId = ref(null);
const messageIdCounter = ref(0);
const messagesContainer = ref(null);

// Sidebar collapse
const isCollapsed = ref(false);
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

// Load chat history on mount
onMounted(async () => {
  try {
    const res = await api.get('/api/chats');
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

function loadChat(chatId) {
  const chatThread = chatsHistory.value.find(c => c.id === chatId);
  if (!chatThread) return;
  activeChatId.value = chatId;
  messages.value = [];
  messageIdCounter.value = 0;
  chatThread.messages.forEach(chatItem => {
    messages.value.push({ id: ++messageIdCounter.value, sender: 'You', text: chatItem.message });
    messages.value.push({ id: ++messageIdCounter.value, sender: 'Bot', text: chatItem.response });
  });
  scrollToBottom();
}

function getChatTopic(chatThread) {
  if (!chatThread.messages || chatThread.messages.length === 0) return "New Chat";
  const firstUserMsg = chatThread.messages.find(msg => msg.message);
  if (!firstUserMsg) return "New Chat";
  return firstUserMsg.message.length > 30
    ? firstUserMsg.message.slice(0, 30) + "..."
    : firstUserMsg.message;
}

async function sendMessage() {
  const trimmed = input.value.trim();
  if (!trimmed) return;

  messages.value.push({ id: ++messageIdCounter.value, sender: 'You', text: trimmed });
  input.value = '';
  scrollToBottom();

  try {
    const res = await api.post('/api/chatbot', { prompt: trimmed });
    const botMessage = { id: ++messageIdCounter.value, sender: 'Bot', text: res.data.reply };
    messages.value.push(botMessage);
    scrollToBottom();

    if (!activeChatId.value) {
      const newChat = { id: res.data.chat.id, messages: [{ message: trimmed, response: res.data.reply }] };
      chatsHistory.value.push(newChat);
      activeChatId.value = newChat.id;
    } else {
      const chatThread = chatsHistory.value.find(c => c.id === activeChatId.value);
      chatThread.messages.push({ message: trimmed, response: res.data.reply });
    }
  } catch (err) {
    console.error('Chat error:', err);
    messages.value.push({ id: ++messageIdCounter.value, sender: 'Bot', text: 'Oops! Something went wrong.' });
    scrollToBottom();
  }
}

// Delete chat
async function deleteChat(chatId) {
  try {
    await api.delete(`/api/chats/${chatId}`);
    chatsHistory.value = chatsHistory.value.filter(c => c.id !== chatId);
    if (activeChatId.value === chatId) {
      startNewChat();
    }
  } catch (err) {
    console.error("Failed to delete chat:", err);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

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
  margin: 40px auto;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  transition: all 0.3s;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #0f2027, #203a43, #2c5364);
  padding: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  transition: all 0.3s;
}

.sidebar.collapsed {
  width: 50px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #fff;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  width: 28px;
  height: 28px;
}

.new-chat-btn {
  padding: 4px 8px;
  font-size: 0.8rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  cursor: pointer;
  transition: all 0.3s;
}

.new-chat-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 5px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.sidebar li.active, .sidebar li:hover {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.5);
}

.delete-chat-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.delete-chat-btn:hover {
  transform: scale(1.2);
}

/* Chat area */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  color: #fff;
  transition: margin-left 0.3s;
}

h2 {
  text-align: center;
  margin-bottom: 10px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.message {
  max-width: 70%;
  padding: 12px;
  border-radius: 15px;
  word-wrap: break-word;
  transition: all 0.3s;
}

.message.user {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  align-self: flex-end;
  border-bottom-right-radius: 0;
}

.message.bot {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  align-self: flex-start;
  border-bottom-left-radius: 0;
  backdrop-filter: blur(10px);
}

/* Input area */
.input-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.submit-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}
</style>
