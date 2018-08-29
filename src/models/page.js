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
    if (_.isArray(attrName)) {
      return _.get(this.properties, attrName)
    }
    else if (_.keys(this.properties).find(x => attrName.indexOf(x) === 0 )) {
      return _.get(this.properties, attrName)
    }
    else if (attrName === 'children') {
      return this.get('body').map(component => {
        return new BentoComponent(component)
      })
    }
    else if (attrName.indexOf('site.') === 0) {
      return this.site.get(attrName.replace('site.',''))
    }
    else {
      return super.get(attrName)
    }
  }

  set(attrName, newValue) {
    if (_.keys(this.properties).find(x => attrName.indexOf(x) > -1 )) {
      return _.set(this.properties, attrName, newValue)
    }
    else if (attrName === 'children') {
      this.set('body', newValue)
    }
    else if (attrName.indexOf('site.') === 0) {
      attrName = attrName.replace('site.','')
      return this.site.set(attrName, newValue)
    }
    else {
      super.set(attrName)
    }
  }



  getJsonBody() {
    return JSON.stringify(this.properties.body)
  }

  // get body() {
  //   return this.properties.body
  // }

  // set body(newValue) {
  //   this.properties.body = newValue
  // }

  // get children() {
  //   return this.body.map(component => {
  //     return new BentoComponent(component)
  //   })
  // }

  // set children(newValue) {
  //   this.body = newValue
  // }

  // get variables() {
  //   return this.properties.variables
  // }

  // set variables(newValue) {
  //   this.properties.variables = newValue
  // }

  get bentoManifest() {
    return BentoManifest.build('container', 'component')
  }
}
