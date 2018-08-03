import Model from '@/services/extended-vuex-orm-model'
import Site from './page'
import BentoComponent from './bento/component'
import BentoManifest from './bento/_manifest'

export default class Page extends Model {
  static entity = 'pages'

  static fields () {
    return {
      id:         this.attr(null),
      type:       this.attr('pages'),
      path:       this.attr(''),
      properties: this.attr({}),
      
      site_id: this.attr(null),

      site:  this.belongsTo(Site, 'site_id'),

      // meta
      $site_queried: this.attr(false),
    }
  }

  serializedChanges() {
    return { properties: this.properties }
  }

  getJsonBody() {
    return JSON.stringify(this.properties.body)
  }

  getJsonVariables() {
    return JSON.stringify(this.properties.variables)
  }

  get body() {
    console.log('wut', this.properties.body.constructor.name)
    return this.properties.body
  }

  set body(newValue) {
    this.properties.body = newValue
  }

  get children() {
    return this.body.map(component => {
      return new BentoComponent(component)
    })
  }

  set children(newValue) {
    this.body = newValue
  }

  get variables() {
    return this.properties.variables
  }

  set variables(newValue) {
    this.properties.variables = newValue
  }

  get bentoManifest() {
    return BentoManifest.build('container', 'component')
  }
}
