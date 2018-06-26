import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard'

import Login from '@/views/Login'
import Logout from '@/views/Logout'

import SiteIndex from '@/views/Sites/Index'
import SiteShow from '@/views/Sites/Show'

import SitePageEdit from '@/views/Sites/Pages/Edit'

import MallRoutes from '@/router/malls'

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
      path: '/sites',
      name: 'SiteIndex',
      component: SiteIndex
    },
    {
      path: '/sites/:site_id',
      name: 'SiteShow',
      component: SiteShow
    },
    {
      path: '/sites/:site_id/pages/:page_id',
      name: 'SitePageEdit',
      component: SitePageEdit
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    }
  ].concat(MallRoutes)
})
