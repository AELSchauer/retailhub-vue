import CompanyIndex from '@/views/Companies/Index'
import CompanyShow  from '@/views/Companies/Show'

export default [
  {
    path: '/companies',
    name: 'CompanyIndex',
    component: CompanyIndex
  },
  {
    path: '/companies/:company_id',
    name: 'CompanyShow',
    component: CompanyShow
  }
]
