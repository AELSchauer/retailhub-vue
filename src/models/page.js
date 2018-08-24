import Model from '@/services/customized-model'
import Site from './site'
import BentoComponent from './bento/component'
import BentoManifest from './bento/manifest/index'

export default class Page extends Model {
  static entity = 'pages'

  static fields () {
    return {
      id:         this.attr(null),
      type:       this.attr('pages'),
      path:       this.attr(''),
      properties: this.attr(''),
      
      site_id: this.attr(null),

      site: this.belongsTo(Site, 'site_id'),

      // meta
      $site_queried: this.attr(false),
    }
  }

  get(attrName) {
    if (attrName === 'variables') {
      return this.properties.variables
    }
    else {
      return super.get(attrName)
    }
  }

  getJsonBody() {
    return JSON.stringify(this.properties.body)
  }

  get body() {
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
