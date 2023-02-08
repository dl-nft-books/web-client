import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES, ROUTE_METAS, PAGE_TECHNICAL_STATE } from '@/enums'
import { config } from '@/config'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.bookshelf },
  },
  {
    path: '/about-us',
    name: ROUTE_NAMES.aboutUs,
    component: () => import('@/pages/about-us/AboutUs.vue'),
    meta: { [ROUTE_METAS.isDarkPage]: true },
  },
  {
    path: '/bookshelf',
    name: ROUTE_NAMES.bookshelf,
    component: () => import('@/pages/bookshelf/BookshelfPage.vue'),
  },
  {
    path: '/bookshelf/:id',
    name: ROUTE_NAMES.bookshelfItem,
    props: true,
    component: () => import('@/pages/bookshelf/BookshelfItemPage.vue'),
  },
  {
    path: '/my-nfts',
    name: ROUTE_NAMES.myNfts,
    component: () => import('@/pages/my-nfts/MyNFTsPage.vue'),
  },
  {
    path: '/my-nft/:id',
    props: true,
    name: ROUTE_NAMES.myNftItem,
    component: () => import('@/pages/my-nfts/MyNftItemPage.vue'),
  },
  {
    path: '/faq',
    name: ROUTE_NAMES.faq,
    component: () => import('@/pages/faq/FaqPage.vue'),
    meta: { [ROUTE_METAS.isDarkPage]: true },
  },
  {
    path: '/technical-work',
    name: ROUTE_NAMES.technicalWork,
    component: () => import('@/pages/TechnicalWork.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

const restrictedRoutes = [
  ROUTE_NAMES.bookshelf,
  ROUTE_NAMES.bookshelfItem,
  ROUTE_NAMES.myNftItem,
  ROUTE_NAMES.myNfts,
]

router.beforeEach((to, _, next) => {
  if (
    config.TECHNICAL_STATE === PAGE_TECHNICAL_STATE.updating &&
    restrictedRoutes.some(route => route === to.name)
  ) {
    return next({ name: ROUTE_NAMES.technicalWork })
  }
  next()
})

export { router, useRouter, useRoute }
