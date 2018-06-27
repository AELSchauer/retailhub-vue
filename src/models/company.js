// import { Model } from '@vuex-orm/core'
import Model from '@/services/extended-vuex-orm-model'
import Mall from './mall'

export default class Company extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'companies'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id:       this.attr(null),
      name:     this.attr(''),
      seo_slug: this.attr(''),

      malls: this.hasMany(Mall, 'company_id')
    }
  }
}