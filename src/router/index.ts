import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.buttons },
  },
  {
    path: '/buttons',
    name: ROUTE_NAMES.buttons,
    component: () => import('@/pages/ButtonsPage.vue'),
  },
  {
    path: '/inputs',
    name: ROUTE_NAMES.inputs,
    component: () => import('@/pages/InputsPage.vue'),
  },
  {
    path: '/forms',
    name: ROUTE_NAMES.forms,
    component: () => import('@/pages/FormsPage.vue'),
  },
  {
    path: '/common',
    name: ROUTE_NAMES.common,
    component: () => import('@/pages/CommonPage.vue'),
  },
  {
    path: '/web3',
    name: ROUTE_NAMES.web3,
    component: () => import('@/pages/Web3Page.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
