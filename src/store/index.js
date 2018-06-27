import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

import database from './database'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  modules: {
    auth
  }
})
