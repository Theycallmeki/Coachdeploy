import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import Goals from '../pages/Goals.vue';
import BMI from '../pages/BMI.vue';
import Chat from '../pages/Chat.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/goals', component: Goals },
  { path: '/bmi', component: BMI },
  { path: '/chat', component: Chat },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
