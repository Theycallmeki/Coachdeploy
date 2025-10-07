<template>
  <div id="app">
    <!-- Hide Navbar on /auth route -->
    <Navbar v-if="$route.path !== '/auth'" />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar },
};
</script>

<style>
/* Set global font and remove default spacing */
body, #app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  
  /* AI Coach Theme Background */
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;

  /* Optional subtle animated gradient effect */
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;

  display: flex;
  flex-direction: column;
}

/* Gradient Animation for dynamic AI feel */
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Navbar default styling (optional tweaks) */
.navbar {
  background: rgba(0, 0, 0, 0.4); /* translucent navbar for modern look */
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  color: #fff;
}

/* Example router-view container */
router-view {
  flex: 1;
  padding: 2rem;
}
</style>
