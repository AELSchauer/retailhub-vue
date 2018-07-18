import Model from '@/services/extended-vuex-orm-model'
import Page from './page'

export default class Site extends Model {
  static entity = 'sites'

  static fields () {
    return {
      id:                    this.attr(null),
      type:                  this.attr('sites'),
      name:                  this.attr(''),
      is_live:               this.attr(false),
      published_at:          this.attr(''),
      canonical_domain_name: this.attr(''),
      properties:            this.attr(''),
      
      pages: this.hasMany(Page, 'site_id'),

      // meta
      $pages_queried: this.attr(false),
    }
  }
}
