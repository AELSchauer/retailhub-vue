import _ from 'lodash'
import Site from './site'
import BentoComponent from './bento/component'

export default class Page {
  constructor (json) {
    this.id   = json.id
    this.type = 'pages'

    if (json.attributes) {
      this.path      = json.attributes.path
      this.variables = json.attributes.properties.variables
      this._body     = (json.attributes.properties.body || [])
    }

    this.relationships = (json.included || [])
  }

  get name() {
    return this.path
  }

  get site() {
    let _this = this;
    let site = this.relationships.filter(x => x.type === 'sites')[0]
    return new Site(_.merge(site, {
      included: [ { id: this.id, type: this.type } ]
    }));
  }

  get body() {
    return this._body.map(component => {
      return new BentoComponent(component)
    })
  }
}
