import Model from '@/services/extended-vuex-orm-model'

import Mall from './mall'
import DealStore from './deal-store'
import Retailer from './retailer'
import Store from './store'

export default class Deal extends Model {
  static entity = 'deals'

  static fields () {
    return {
      id:     this.attr(null),
      type:   this.attr('deals'),
      title:  this.attr(''),
      
      retailer_id:  this.attr(null),

      retailer: this.belongsTo(Retailer, 'retailer_id'),
      stores:   this.belongsToMany(Store, DealStore, 'deal_id', 'store_id'),

      // meta attributes
      retailer_queried: this.attr(false),
      stores_queried:   this.attr(false)
    }
  }
}
