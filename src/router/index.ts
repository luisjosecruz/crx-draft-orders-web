import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/Root.vue')
  },
  {
    path: '/create-orders',
    name: 'create-order',
    component: () => import('@/views/DraftOrders/DraftOrders.vue')
  },
  {
    path: '/order-created-successfully',
    name: 'order-created',
    component: () => import('@/views/DraftOrders/OrderCreated.vue'),
    beforeEnter: (to, from, next) => {
      if (from.name === 'create-order') {
         next()
      } else {
         next({ name: 'root' })
      }
   },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = import.meta.env.VITE_APP_NAME
  
  next()
})

export default router
