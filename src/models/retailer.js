// import { Model } from '@vuex-orm/core'
import Model from '@/services/custom-vuex-orm-model'
import Deal from './deal'
import Store from './store'

export default class Retailer extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'retailers'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id:       this.attr(null),
      type:     this.attr('retailers'),
      name:     this.attr(''),

      deals:  this.hasMany(Deal, 'retailer_id'),
      stores: this.hasMany(Store, 'retailer_id'),

      // meta
      $deals_queried:  this.attr(false),
      $stores_queried: this.attr(false),
    }
  }
}
