import Model from '@/services/extended-vuex-orm-model'
import Mall from './mall'

export default class Company extends Model {
  static entity = 'companies'

  static fields () {
    return {
      id:       this.attr(null),
      name:     this.attr(''),
      seo_slug: this.attr(''),

      malls: this.hasMany(Mall, 'company_id'),

      // meta
      $malls_queried: this.attr(false),
    }
  }
}
