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
    path: '/management',
    name: 'Management',
    component: () => import('@/views/Management.vue')
  },
  {
    path: '/attendances',
    name: 'Attendances',
    component: () => import('@/views/Attendances.vue')
  },
  {
    path: '/class',
    name: 'Classes',
    component: () => import('@/views/Classes.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/aplication',
    name: 'Daemon',
    component: () => import('@/views/Daemon.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
