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
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue')
  },
  {
    path: '/attendances',
    name: 'Attendances',
    component: () => import('@/views/Attendances.vue')
  },
  {
    path: '/analisis',
    name: 'Analysis',
    component: () => import('@/views/Analysis.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('@/views/Students.vue')
  },
  {
    path: '/aplication',
    name: 'aiApps',
    component: () => import('@/views/aiApp.vue')
  },
  {
    path: '/classroom',
    name: 'aiModules',
    component: () => import('@/views/aiModules.vue')
  },
  {
    path: '/grade',
    name: 'Curso',
    component: () => import('@/views/Grade.vue')
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
