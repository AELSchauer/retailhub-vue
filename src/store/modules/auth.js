import User from '@/models/User'
import * as MutationTypes from '@/store/mutation-types'

const state = {
  user: User.from(localStorage.json)
}

const getters = {
  currentUser (state) {
    return state.user
  }
}

const mutations = {
  [MutationTypes.LOGIN] (state) {
    state.user = User.from(localStorage.json)
  },
  [MutationTypes.LOGOUT] (state) {
    state.user = null
  }
}

const actions = {
  login({ commit }) {
    commit(MutationTypes.LOGIN)
  },
  logout ({ commit }) {
    commit(MutationTypes.LOGOUT)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
