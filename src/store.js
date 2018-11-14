import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

// 模拟获取用户信息请求接口
function fetchUserInfo (token) {
  if (token === 'usertoken') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          msg: 'success',
          data: {
            id: 1,
            name: 'Johnson',
            email: 'love@joenlee.cn',
            menus: [
              {
                title: '个人中心',
                name: 'UserCenter'
              }
            ]
          }
        })
      }, 1500)
    })
  } else {
    return Promise.resolve({
      code: 100,
      msg: 'token失效'
    })
  }
}

// 模拟登录请求
function login (account) {
  if (account.username === 'johnson' && account.password === 'abc123') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          msg: 'success',
          data: {
            token: 'usertoken',
            userInfo: {
              id: 1,
              name: 'Johnson',
              email: 'love@joenlee.cn',
              menus: [
                {
                  title: '个人中心',
                  name: 'UserCenter'
                }
              ]
            }
          }
        })
      }, 1500)
    })
  } else {
    return Promise.resolve({
      code: 100,
      msg: '用户名或密码错误'
    })
  }
}

const dynamicRoutes = [
  {
    path: '/manage',
    name: 'Manage',
    meta: {
      requireAuth: true
    },
    component: () => import('./views/Manage')
  },
  {
    path: '/userCenter',
    name: 'UserCenter',
    meta: {
      requireAuth: true
    },
    component: () => import('./views/UserCenter')
  }
]

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token'),
    auth: false,
    userInfo: {},
    userRoutes: []
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    clearToken (state) {
      state.token = ''
      window.localStorage.setItem('token', '')
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      state.auth = true // 获取到用户信息的同时将auth标记为true，当然也可以直接判断userInfo
      // 生成用户路由表
      state.userRoutes = dynamicRoutes.filter(route => {
        return userInfo.menus.some(menu => menu.name === route.name)
      })
      router.addRoutes(state.userRoutes) // 注册路由
    }
  },
  actions: {
    async getUserInfo (ctx, token) {
      return fetchUserInfo(token).then(response => {
        if (response.code === 200) {
          ctx.commit('setUserInfo', response.data)
        }
        return response
      })
    },
    async login (ctx, account) {
      return login(account).then(response => {
        if (response.code === 200) {
          ctx.commit('setUserInfo', response.data.userInfo)
          ctx.commit('setToken', response.data.token)
        }
      })
    }
  }
})
