import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user') || 'null')
  },
  mutations: {
    setUser (state, payload: string) {
      state.user = JSON.parse(payload)
      localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
