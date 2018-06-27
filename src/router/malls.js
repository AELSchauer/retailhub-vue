import MallIndex from '@/views/Malls/Index'
import MallShow  from '@/views/Malls/Show'

export default [
  {
    path: '/malls',
    name: 'MallIndex',
    component: MallIndex
  },
  {
    path: '/malls/:mall_id',
    name: 'MallShow',
    component: MallShow
  }
]
