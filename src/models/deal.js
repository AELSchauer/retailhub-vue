import Model from '@/services/extended-vuex-orm-model'

import Mall from './mall'
import DealStore from './deal-store'
import Retailer from './retailer'
import Store from './store'

export default class Deal extends Model {
  static entity = 'deals'

  static fields () {
    return {
      id:   this.attr(null),
      type: this.attr('deals'),

      title:                  this.attr(''),
      seo_slug:               this.attr(''),
      sales_type:             this.attr(''),
      description:            this.attr(''),
      fine_print_description: this.attr(''),
      external_url:           this.attr(''),
      is_local:               this.attr(false),
      is_featured:            this.attr(false),
      is_live:                this.attr(false),
      start_at:               this.attr(''),
      display_at:             this.attr(''),
      end_at:                 this.attr(''),
      end_at_text:            this.attr(''),

      retailer_id:  this.attr(null),

      retailer: this.belongsTo(Retailer, 'retailer_id'),
      stores:   this.belongsToMany(Store, DealStore, 'deal_id', 'store_id'),

      // meta attributes
      retailer_queried: this.attr(false),
      stores_queried:   this.attr(false)
    }
  }
}