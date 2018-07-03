import DealIndex from '@/views/Deals/Index'
import DealShow  from '@/views/Deals/Show'

export default [
  {
    path: '/deals',
    name: 'DealIndex',
    component: DealIndex
  },
  {
    path: '/deals/:deal_id',
    name: 'DealShow',
    component: DealShow
  },
]
