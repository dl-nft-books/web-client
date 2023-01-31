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
    redirect: { name: ROUTE_NAMES.bookshelf },
  },
  {
    path: '/about-us',
    name: ROUTE_NAMES.aboutUs,
    component: () => import('@/pages/AboutUs.vue'),
  },
  {
    path: '/bookshelf',
    name: ROUTE_NAMES.bookshelf,
    component: () => import('@/pages/Bookshelf/BookshelfPage.vue'),
  },
  {
    path: '/bookshelf/:id',
    name: ROUTE_NAMES.bookshelfItem,
    props: true,
    component: () => import('@/pages/Bookshelf/BookshelfItemPage.vue'),
  },
  {
    path: '/my-nfts',
    name: ROUTE_NAMES.myNfts,
    component: () => import('@/pages/MyNfts/MyNFTsPage.vue'),
  },
  {
    path: '/my-nft/:id',
    props: true,
    name: ROUTE_NAMES.myNftItem,
    component: () => import('@/pages/MyNfts/MyNftItemPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
