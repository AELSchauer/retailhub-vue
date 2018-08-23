import _ from 'lodash'
import moment from 'moment'

import Model from '@/services/customized-model'
import Page from './page'

export default class Site extends Model {
  static entity = 'sites'

  static fields () {
    return {
      id:                    this.attr(0),
      type:                  this.attr('sites'),
      name:                  this.attr(''),
      is_published:          this.attr(false),
      published_at:          this.attr(''),
      canonical_domain_name: this.attr(''),
      is_live:               this.attr(false),
      properties:            this.attr(''),
      
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

  static get dateAttributeNames() {
    return ['published_at']
  }

  get partials() {
    return this.properties.partials
  }

  // get(attr) {
  //   if (this[attr] === null) {
  //     return this.constructor.fields()[attr].value
  //   }
  //   else if (_.includes(this.constructor.dateAttributeNames, attr)) {
  //     return moment.utc(this[attr])
  //   }
  //   else {
  //     return this[attr]
  //   }
  // }

  // set(attr, newValue) {
  //   let dateAttributeNames = this.constructor.dateAttributeNames || [];

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
}
