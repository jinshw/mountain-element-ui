import { login, logout, getInfo, addUser, listPage } from '@/api/user'
import { getToken, setToken, setCookies, removeToken, setLocalStorage, removeLocalStorage } from '@/utils/auth'
import { resetRouter, remoteRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.status !== 30001) {
          const { data } = response
          console.log('user login..111', response, data)
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          if (response.data.sessionId !== undefined) {
            setCookies('sessionId', response.data.sessionId)
          }
          setLocalStorage('router', response.sysMenus.children)
          remoteRouter(response.sysMenus)
        }

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_AVATAR', 'static/image/head-img.png')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.log('logout....')
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        removeLocalStorage('router')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // user list
  list({ commit }, params) {
    // const { username, password } = params
    return new Promise((resolve, reject) => {
      // getList(params).then(response => {
      listPage(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user add
  add({ commit }, params) {
    console.log('add---', params)
    return new Promise((resolve, reject) => {
      addUser(params).then(response => {
        const { data } = response
        console.log('addUser.......', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

