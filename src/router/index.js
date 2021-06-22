import { createRouter, createWebHashHistory } from 'vue-router'
// import store from '../store'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../components/Home'),
      meta: {
        index: 1
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../components/Projects'),
      meta: {
        index: 1
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../components/Help'),
      meta: {
        index: 1
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router