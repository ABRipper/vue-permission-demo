import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/Login')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!store.state.auth) { // 检查是否已登录
      if (store.state.token) { // 未登录，但是有token，获取用户信息
        try {
          const data = await store.dispatch('getUserInfo', store.state.token)
          if (data.code === 200) {
            next()
          } else {
            window.alert('请登录')
            store.commit('clearToken')
            next({ name: 'Login' })
          }
        } catch (err) {
          window.alert('请登录')
          store.commit('clearToken')
          next({ name: 'Login' })
        }
      } else {
        window.alert('请登录')
        next({ name: 'Login' })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
