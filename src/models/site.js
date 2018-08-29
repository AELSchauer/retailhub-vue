import _ from 'lodash'
import moment from 'moment'

import Model from '@/services/customized-model'
import Page from './page'
import BentoPartial from './bento/partial'
import BentoManifest from './bento/manifest/index'

export default class Site extends Model {
  static entity = 'sites'

  static fields () {
    return {
      id:                    this.attr(0),
      type:                  this.attr('sites'),
      name:                  this.attr(''),
      is_published:          this.attr(false),
      // published_at:          this.attr(''),
      canonical_domain_name: this.attr(''),
      is_live:               this.attr(false),
      properties:            this.attr(''),
      
      pages: this.hasMany(Page, 'site_id'),

      // meta
      $pages_queried: this.attr(false),
    }
  }

  // static mutators() {
  //   return {
  //     published_at(value) {
  //       return moment.utc(value, 'YYYY-MM-DD HH:mm:ss')
  //     },
  //   }
  // }

  static get dateAttributeNames() {
    return ['published_at']
  }

  get(attrName) {
    if (_.isArray(attrName)) {
      return _.get(this.get(attrName[0]), attrName.slice(1))
    }
    else if (attrName === 'partials') {
      return this.properties.partials.map(partial => {
        return new BentoPartial(partial)
      })
    }
    else if (_.keys(this.properties).find(x => attrName.indexOf(x) === 0 )) {
      return _.get(this.properties, attrName)
    }
    else {
      return super.get(attrName)
    }
  }

  set(attrName, newValue) {
    console.log('attrName', attrName)
    if (_.keys(this.properties).find(x => attrName.indexOf(x) > -1 )) {
      return _.set(this.properties, attrName, newValue)
    }
    else {
      super.set(attrName)
    }
  }

  _isChanged(attrName, oldVal, newVal) {
    if (attrName === 'properties') {
      return JSON.stringify(oldVal) != JSON.stringify(newVal)
    }
    else {
      return super._isChanged(attrName, oldVal, newVal)
    }
  }
}
