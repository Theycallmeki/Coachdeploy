<template>
  <div class="homepage">
    <h1 v-if="user">Welcome, {{ user.name }}!</h1>
    <h1 v-else>Welcome to the Vue App!</h1>

    <button v-if="user" @click="logout" class="logout-btn">Logout</button>

    <!-- Chatbot Component -->
    <Chatbot />
  </div>
</template>

<script>
import Chatbot from "../components/Chatbot.vue";
import api from "../services/api"; // connect to backend

export default {
  components: { Chatbot },
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    try {
      const res = await api.get("/auth/check");
      this.user = res.data.user;
    } catch {
      // If not logged in, redirect to login
      this.$router.push("/login");
    }
  },
  methods: {
    async logout() {
      try {
        await api.post("/auth/logout");
        this.user = null;
        this.$router.push("/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    },
  },
};
</script>

<style scoped>
.homepage {
  text-align: center;
  margin-top: 2rem;
}
.logout-btn {
  margin-bottom: 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}
.logout-btn:hover {
  background-color: #d32f2f;
}
</style>
