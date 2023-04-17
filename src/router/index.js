// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }, {
    path: '/attendances',
    name: 'Attendances',
    component: () => import('@/views/Attendances.vue')
  }, {
    path: '/class',
    name: 'Classes',
    component: () => import('@/views/Classes.vue')
  },{
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/views/Calendar.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
