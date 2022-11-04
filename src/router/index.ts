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
    redirect: { name: ROUTE_NAMES.home },
  },
  {
    path: '/ui-kit',
    name: ROUTE_NAMES.uiKit,
    component: () => import('@/pages/UiKitPage.vue'),
  },
  {
    path: '/',
    name: ROUTE_NAMES.home,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/bookshelf',
    name: ROUTE_NAMES.bookshelf,
    component: () => import('@/pages/BookshelfPage.vue'),
  },
  {
    path: '/bookshelf/:id',
    name: ROUTE_NAMES.bookshelfItem,
    props: true,
    component: () => import('@/pages/BookshelfItemPage.vue'),
  },
  {
    path: '/my-nfts',
    name: ROUTE_NAMES.myNFTs,
    component: () => import('@/pages/MyNFTsPage.vue'),
  },
  {
    path: '/my-nft/:id',
    name: ROUTE_NAMES.myNftItem,
    component: () => import('@/pages/MyNftItemPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
