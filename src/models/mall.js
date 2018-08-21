import Model from '@/services/custom-vuex-orm-model'

import Company from './company'
import Image from './image'
import Store from './store'

export default class Mall extends Model {
  static entity = 'malls'

  static fields () {
    return {
      id:     this.attr(null),
      type:   this.attr('malls'),
      name:   this.attr(''),
      city:   this.attr(''),
      state:  this.attr(''),
      
      company_id: this.attr(null),

      company: this.belongsTo(Company, 'company_id'),
      // images:  this.morphMany(Image, 'imageable_id', 'imageable_type'),
      stores:  this.hasMany(Store, 'mall_id'),

      // meta
      $company_queried: this.attr(false),
      $images_queried:  this.attr(false),
      $stores_queried:  this.attr(false),
    }
  }
}
