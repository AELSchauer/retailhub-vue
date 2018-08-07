import SiteIndex from '@/views/Sites/Index'
import SiteShow from '@/views/Sites/Show'
import SitePartialEdit from '@/views/Sites/Edit'
import SitePageEdit from '@/views/Sites/Pages/Edit'

export default [
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
    path: '/sites/:site_id/edit',
    name: 'SitePartialEdit',
    component: SitePartialEdit
  },
  {
    path: '/sites/:site_id/pages/:page_id',
    name: 'SitePageEdit',
    component: SitePageEdit
  },
]
