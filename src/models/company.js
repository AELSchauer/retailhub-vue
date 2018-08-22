import Model from '@/services/customized-model'
import Mall from './mall'

export default class Company extends Model {
  static entity = 'companies'

  static fields () {
    return {
      id:   this.attr(null),
      type: this.attr('companies'),

      name:     this.attr(''),
      seo_slug: this.attr(''),

      malls:  this.hasMany(Mall, 'company_id'),

      // meta
      $malls_queried:  this.attr(false),
    }
  }
}
