import DealIndex from '@/views/Deals/Index'
import DealNew   from '@/views/Deals/New'
import DealShow  from '@/views/Deals/Show'

export default [
  {
    path: '/deals',
    name: 'DealIndex',
    component: DealIndex
  },
  {
    path: '/deals/new',
    name: 'DealNew',
    component: DealNew
  },
  {
    path: '/deals/:deal_id',
    name: 'DealShow',
    component: DealShow
  },
]
