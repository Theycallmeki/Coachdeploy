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
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
