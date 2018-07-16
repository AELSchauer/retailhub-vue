import * as MutationTypes from '@/store/mutation-types'

const state = {
  breadcrumbs: [],
}

const mutations = {
  [MutationTypes.BREADCRUMBS](state, payload) {
    state.breadcrumbs = payload
  },
}

const actions = {
  breadcrumbs({ commit }, payload) {
    commit(MutationTypes.BREADCRUMBS, payload)
  },
}

const getters = {
  breadcrumbs(state) {
    return state.breadcrumbs
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
