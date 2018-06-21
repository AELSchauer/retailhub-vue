import _ from 'lodash'
import Page from './page'

export default class Site {
  constructor (json) {
    this.id            = json.id
    this.type          = 'sites'

    if (json.attributes) {
      this.name          = json.attributes.name
      this.canonDomain   = json.attributes.canonical_domain_name
      this.isLive        = json.attributes.is_live
      this.publishedAt   = json.attributes.published_at
      this.api           = json.attributes.properties.api
      this.variables     = json.attributes.properties.variables
      this.partials      = json.attributes.properties.partials
    }

    this.relationships = (json.included || [])
  }

  get pages() {
    let _this = this
    let pages = this.relationships.filter(x => x.type === 'pages')
    return pages.map(page => new Page(_.merge(page, {
      included: [ { id: this.id, type: this.type } ]
    })))
  }
}
