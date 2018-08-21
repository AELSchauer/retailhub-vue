import _ from 'lodash'
import moment from 'moment'

import Model from '@/services/custom-vuex-orm-model'
import Mall from './mall'
import DealStore from './deal-store'
import Retailer from './retailer'
import Store from './store'

export default class Deal extends Model {
  static entity = 'deals'

  static fields() {
    let today = moment.utc().startOf('day');
    return {
      id:   this.attr(null),
      type: this.attr('deals'),

      title:                  this.attr(''),
      seo_slug:               this.attr(''),
      sales_type:             this.attr(null),
      description:            this.attr(''),
      fine_print_description: this.attr(''),
      external_url:           this.attr(''),
      is_local:               this.attr(false),
      is_featured:            this.attr(false),
      is_live:                this.attr(false),
      start_at:               this.attr(today),
      display_at:             this.attr(today),
      end_at:                 this.attr(today.add(1, 'd')),
      end_at_text:            this.attr(''),

      retailer_id:  this.attr(null),

      retailer: this.belongsTo(Retailer, 'retailer_id'),
      stores:   this.belongsToMany(Store, DealStore, 'deal_id', 'store_id'),

      // meta attributes
      $retailer_queried: this.attr(false),
      $stores_queried:   this.attr(false)
    }
  }

  static mutators() {
    return {
      start_at(value) {
        return moment.utc(value, 'YYYY-MM-DD HH:mm:ss')
      },
      display_at(value) {
        return moment.utc(value, 'YYYY-MM-DD HH:mm:ss')
      },
      end_at(value) {
        return moment.utc(value, 'YYYY-MM-DD HH:mm:ss')
      },
      end_at_text(value) {
        if (moment.utc(value).isValid()) {
          return 'Show Dates'
        }
        else {
          return value
        }
      }
    }
  }

  static dateAttributeNames() {
    return ['start_at', 'display_at', 'end_at']
  }

  get serializationKeyMap() {
    // End_at_date is being removed because The API doesn't currently support 
    // end_date_visibility or end_at_text in post or patch requests
    return {
      // end_at_text: 'end_date_visibility',
      end_at_text: null,
      retailer_id: null,
      type: null,
    }
  }

  get attributeManifest() {
    let modelLabelMap = {
      external_url: 'Website Address',
      fine_print_description: 'Fine Print',
      sales_type: 'Sale Type',
      end_at_text: 'End Date Text',
    }

    return this._attributeManifest({ labelMap: modelLabelMap })
  }
}
