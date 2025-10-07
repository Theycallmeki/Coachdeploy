import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Home from '../pages/Home.vue';
import Auth from '../pages/Auth.vue';
import Goals from '../pages/Goals.vue';
import BMI from '../pages/BMI.vue';
import Chat from '../pages/Chat.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } }, // Protect home
  { path: '/auth', component: Auth },
  { path: '/goals', component: Goals, meta: { requiresAuth: true } },
  { path: '/bmi', component: BMI, meta: { requiresAuth: true } },
  { path: '/chat', component: Chat, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await axios.get('http://localhost:3001/auth/check', {
        withCredentials: true,
      });
      if (res.data.loggedIn) {
        next();
      } else {
        next('/auth'); // Redirect to auth if not logged in
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      next('/auth'); // Redirect on error
    }
  } else {
    next();
  }
});

export default router;
