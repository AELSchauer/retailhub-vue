// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

require('../lib/extensions/string.js');
require('@/styles/custom-bootstrap.scss')
require('@/styles/style.css')

import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'

import VueAxios from 'vue-axios'
import axiosConfig from '@/config/axios'

import VModal from 'vue-js-modal'
import BootstrapVue from 'bootstrap-vue'
import fontAwesome from '@/services/import-font-awesome'

Vue.component('font-awesome-icon', fontAwesome)
Vue.config.productionTip = false

Vue.use(VueAxios, axiosConfig)
Vue.use(VModal)
Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
