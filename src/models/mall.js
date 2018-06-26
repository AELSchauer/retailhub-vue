import { Model } from '@vuex-orm/core'
import Company from './company'

export default class Mall extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'malls'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      city: this.attr(''),
      state: this.attr(''),
      
      company_id: this.attr(null),

      company: this.belongsTo(Company, 'company_id')
    }
  }
}
