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

  get(attrName) {
    if (attrName === 'variables') {
      return this.properties.variables
    }
    if (attrName === 'partials') {
      return this.properties.partials
    }
    else {
      return super.get(attrName)
    }
  }
}
