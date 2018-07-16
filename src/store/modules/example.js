import * as MutationTypes from '@/store/mutation-types'

const state = {
  count: 0,
}

const mutations = {
  [MutationTypes.INCREMENT](state) {
    state.count++
  },
}

const actions = {
  increment({ commit }) {
    commit(MutationTypes.INCREMENT)
  },
}

const getters = {
  increment(state) {
    return state.count
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
