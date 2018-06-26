import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

import Mall from '@/models/mall'
import Company from '@/models/company'

import auth from './modules/auth'
import malls from './modules/malls'
import companies from './modules/companies'

Vue.use(Vuex)

const database = new VuexORM.Database()
database.register(Mall, malls)
database.register(Company, companies)

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  modules: {
    auth
  }
})
