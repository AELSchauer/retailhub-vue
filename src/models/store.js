import Model from '@/services/customized-model'

import Deal from './deal'
import DealStore from './deal-store'
import Image from './image'
import Mall from './mall'
import Retailer from './retailer'

export default class Store extends Model {
  static entity = 'stores'

  static fields () {
    return {
      id:   this.attr(null),
      type: this.attr('stores'),

      name:     this.attr(''),
      seo_slug: this.attr(''),
      address:  this.attr(''),
      city:     this.attr(''),
      state:    this.attr(''),
      
      mall_id:      this.attr(null),
      retailer_id:  this.attr(null),

      deals:    this.belongsToMany(Deal, DealStore, 'store_id', 'deal_id'),
      images:   this.morphMany(Image, 'imageable_id', 'imageable_type'),
      mall:     this.belongsTo(Mall, 'mall_id'),
      retailer: this.belongsTo(Retailer, 'retailer_id'),

      // meta
      $deals_queried:    this.attr(false),
      $images_queried:   this.attr(false),
      $mall_queried:     this.attr(false),
      $retailer_queried: this.attr(false),
    }
  }
}
