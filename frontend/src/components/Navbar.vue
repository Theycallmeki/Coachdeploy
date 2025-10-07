<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/bmi">BMI Calculator</router-link>
      <router-link to="/goals">Goals</router-link>
      <router-link to="/chat">Chat</router-link>
    </nav>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
header {
  background-color: #4CAF50;
  padding: 1rem;
  color: white;
  text-align: center;
}

nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

nav a:hover {
  color: #dfffd8;
}
</style>
