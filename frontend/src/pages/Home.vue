<template>
  <div class="homepage">
    <h1 v-if="user">Welcome, {{ user.name }}!</h1>
    <h1 v-else>Welcome to the Vue App!</h1>

    <!-- Removed logout button -->

    <div v-if="!user">
      <!-- Optional content for logged-out users -->
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
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
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.homepage {
  text-align: center;
  margin-top: 2rem;
}
</style>
