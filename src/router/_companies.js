import CompanyIndex from '@/views/Companies/Index'
import CompanyShow  from '@/views/Companies/Show'
import CompanyNew  from '@/views/Companies/New'

export default [
  {
    path: '/companies',
    name: 'CompanyIndex',
    component: CompanyIndex
  },
  {
    path: '/companies/new',
    name: 'CompanyNew',
    component: CompanyNew
  },
  {
    path: '/companies/:company_id',
    name: 'CompanyShow',
    component: CompanyShow
  },
]
