import * as MutationTypes from '@/store/mutation-types'

const state = {
  queried: false
}

const mutations = {
  [MutationTypes.MARK_AS_QUERIED](state) {
    state.queried = true
  }
}

const actions = {
  markAsQueried({ commit }) {
    commit(MutationTypes.MARK_AS_QUERIED)
  },
}

const getters = {
  isQueried(state) {
    return state.queried
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
