import DealIndex from '@/views/Deals/Index'
import DealNew   from '@/views/Deals/New'
import DealShow  from '@/views/Deals/Show'
import DealEdit  from '@/views/Deals/Edit'

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
  {
    path: '/deals/:deal_id/edit',
    name: 'DealEdit',
    component: DealEdit
  },
]
