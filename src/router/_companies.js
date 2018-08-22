import CompanyIndex from '@/views/Companies/Index'
import CompanyNew   from '@/views/Companies/New'
import CompanyShow  from '@/views/Companies/Show'

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
