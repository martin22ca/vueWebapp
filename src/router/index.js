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
    path: '/personnel',
    name: 'Personnel',
    component: () => import('@/views/Personnel.vue')
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
    name: 'Daemon',
    component: () => import('@/views/Daemon.vue')
  },
  {
    path: '/curso',
    name: 'Curso',
    component: () => import('@/views/Curso.vue')
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
