import { createRouter, createWebHashHistory } from 'vue-router'
import {getUser} from '../services/index';
import { isEmptyObject } from '../utils/tools'

import store from '../store'

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
  const userInfo = store.getters.userInfo

  if (isEmptyObject(userInfo)) {
    getUser().then(result=>{
      store.dispatch('setUserInfo', result.data)
    }).catch(err=>{
      console.log(err)
    })
  } 
  next()
})

export default router