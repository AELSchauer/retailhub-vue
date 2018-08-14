import Model from '@/services/extended-vuex-orm-model'

import Image from './image'
import Mall from './mall'

export default class Company extends Model {
  static entity = 'companies'

  static fields () {
    return {
      id:   this.attr(null),
      type: this.attr('companies'),

      name:     this.attr(''),
      seo_slug: this.attr(''),

      // images:  this.morphMany(Image, 'imageable_id', 'imageable_type'),
      malls:  this.hasMany(Mall, 'company_id'),

      // meta
      $images_queried: this.attr(false),
      $malls_queried:  this.attr(false),
    }
  }
}
