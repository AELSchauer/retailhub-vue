import _ from 'lodash'
import moment from 'moment'

import Model from '@/services/extended-vuex-orm-model'
import Page from './page'
import BentoPartial from './bento/partial'

export default class Site extends Model {
  static entity = 'sites'

  static fields () {
    return {
      id:                    this.attr(0),
      type:                  this.attr('sites'),
      name:                  this.attr(''),
      is_published:          this.attr(false),
      published_at:          this.attr(''),
      is_live:               this.attr(false),
      properties:            this.attr({}),
      
      pages: this.hasMany(Page, 'site_id'),

      // meta
      $pages_queried: this.attr(false),
    }
  }

  static mutators() {
    return {
      published_at(value) {
        return moment.utc(value, 'YYYY-MM-DD HH:mm:ss')
      },
    }
  }

  static dateAttributeNames() {
    return ['published_at']
  }

  serializedProperties() {
    let properties = this.properties
    properties.partials = properties.partials.map(partial => partial.toJSON())
    return { properties: properties }
  }

  get partials() {
    return this.properties.partials.map(partial => {
      if (partial.constructor.name === 'Object') {
        return new BentoPartial(partial)
      }
      return partial
    })
  }

  set partials(newValue) {
    this.properties.partials = newValue
  }

  get(attr) {
    if (this[attr] === null) {
      return this.constructor.fields()[attr].value
    }
    else if (_.includes(this.constructor.dateAttributeNames(), attr)) {
      return moment.utc(this[attr])
    }
    else {
      return this[attr]
    }
  }

  // set(attr, newValue) {
  //   let dateAttributeNames = this.constructor.dateAttributeNames() || [];

  //   function format(attr, value) {
  //     if (attr === 'seo_slug') {
  //       return value.slugify()
  //     }
  //     else if (_.includes((dateAttributeNames || []), attr)) {
  //       return moment.utc(value).format('YYYY-MM-DD HH:mm:ss')
  //     }
  //     else {
  //       return value
  //     }
  //   }

  //   this[attr] = format(attr, newValue)
  // }

  get attributeManifest() {
    // I don't think a manifest is necessary here since all attributes
    // except name are either part of a lifecycle (e.g. 'published_at')
    // or are calculated (e.g. canonical domain name)

    return []
  }
}
