import Model from '@/services/customized-model'
import Deal from './deal'
import Image from './image'
import Store from './store'

export default class Retailer extends Model {
  static entity = 'retailers'

  static fields () {
    return {
      id:       this.attr(null),
      type:     this.attr('retailers'),
      name:     this.attr(''),

      deals:  this.hasMany(Deal, 'retailer_id'),
      images: this.morphMany(Image, 'imageable_id', 'imageable_type'),
      stores: this.hasMany(Store, 'retailer_id'),

      // meta
      $deals_queried:  this.attr(false),
      $images_queried: this.attr(false),
      $stores_queried: this.attr(false),
    }
  }
}
