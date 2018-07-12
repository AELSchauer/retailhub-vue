import _ from 'lodash'
import moment from 'moment'

import Model from '@/services/extended-vuex-orm-model'
import Mall from './mall'
import DealStore from './deal-store'
import Retailer from './retailer'
import Store from './store'

export default class Deal extends Model {
  static entity = 'deals'

  static fields() {
    return {
      id:   this.attr(null),
      type: this.attr('deals'),

      title:                  this.attr(''),
      seo_slug:               this.attr(''),
      sales_type:             this.attr(''),
      description:            this.attr(''),
      fine_print_description: this.attr(''),
      external_url:           this.attr(''),
      is_local:               this.attr(false),
      is_featured:            this.attr(false),
      is_live:                this.attr(false),
      start_at:               this.attr(''),
      display_at:             this.attr(''),
      end_at:                 this.attr(''),
      end_at_text:            this.attr(''),

      retailer_id:  this.attr(null),

      retailer: this.belongsTo(Retailer, 'retailer_id'),
      stores:   this.belongsToMany(Store, DealStore, 'deal_id', 'store_id'),

      // meta attributes
      retailer_queried: this.attr(false),
      stores_queried:   this.attr(false)
    }
  }

  static mutators() {
    return {
      start_at(value) {
        return moment(value, 'YYYY-MM-DD HH:mm:ss')
      },
      display_at(value) {
        return moment(value, 'YYYY-MM-DD HH:mm:ss')
      },
      end_at(value) {
        return moment(value, 'YYYY-MM-DD HH:mm:ss')
      },
      end_at_text(value) {
        if (moment(value).isValid()) {
          return 'Show Dates'
        }
        else {
          return value
        }
      }
    }
  }

  get attributes() {
    let self = this;
    return this.constructor.attributeFieldNames().reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  snapshot() {
    console.log('this.attributes', this.attributes)
    this.snapshot = _.cloneDeep(this.attributes);
  }

  get changes() {
    let self = this
    let snapshot = this.snapshot
    let changes = {}
    _.keys(snapshot).forEach((key) => {
      let old_val = snapshot[key],
          new_val = self[key]

      if (old_val.constructor.name === 'Moment') {
        old_val = this.formatDate(old_val)
        new_val = this.formatDate(new_val)
      }

      if (new_val != old_val) {
        _.set(changes, key, new_val)
      }
    })

    return changes
  }


  formatDate(date) {
    return date.format('YYYY-MM-DD HH:mm')
  }
}
