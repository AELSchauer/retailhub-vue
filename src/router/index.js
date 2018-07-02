import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import Logout from '@/views/Logout'

import CompanyRoutes from '@/router/_companies'
import DealRoutes    from '@/router/_deals'
import MallRoutes    from '@/router/_malls'
import SiteRoutes    from '@/router/_sites'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    }
  ]
  .concat(DealRoutes)
  .concat(MallRoutes)
  .concat(CompanyRoutes)
  .concat(SiteRoutes)
})
