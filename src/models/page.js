import Model from '@/services/extended-vuex-orm-model'
import Site from './page'

export default class Page extends Model {
  static entity = 'pages'

  static fields () {
    return {
      id:         this.attr(null),
      type:       this.attr('pages'),
      path:       this.attr(''),
      properties: this.attr(''),
      
      site_id: this.attr(null),

      site:  this.belongsTo(Site, 'site_id'),

      // meta
      $site_queried: this.attr(false),
    }
  }

  get body() {
    return this.properties.body
  }

  get variables() {
    return this.properties.variables
  }
}
