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
    let today = moment.utc().startOf('day');
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

  get(attr) {
    if (_.includes(this.constructor.dateAttributeNames(), attr)) {
      return moment.utc(this[attr])
    }
    else {
      return this[attr]
    }
  }

  set(attr, newValue) {
    let dateAttributeNames = this.constructor.dateAttributeNames()

    function format(attr, value) {
      if (attr === 'seo_slug') {
        return value.slugify()
      }
      else if (_.includes(dateAttributeNames, attr)) {
        return moment.utc(value).format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return value
      }
    }

    this[attr] = format(attr, newValue)
  }

  get attributes() {
    let self = this;
    return this.constructor.attributeFieldNames().reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  snapshot() {
    this.snapshot = _.cloneDeep(this.attributes);
  }

  rollback() {
    let self = this
    _.keys(this.snapshot).forEach(k => {
      self[k] = self.snapshot[k]
    })
  }

  get changes() {
    let self = this
    let snapshot = this.snapshot
    let changes = {}
    _.keys(snapshot).forEach((key) => {
      let old_val = snapshot[key],
          new_val = self[key]

      if (_.includes(self.constructor.dateAttributeNames(), key)) {
        function formatDate(val) {
          if(val) {
            val = moment.utc(val)
            if (val.isValid()) {
              val = val.format('YYYY-MM-DD HH:mm')
            }
          }
          return val
        }

        old_val = formatDate(old_val)
        new_val = formatDate(new_val)
      }

      if (new_val != old_val) {
        _.set(changes, key, new_val)
      }
    })

    return changes
  }

  get serializedChanges() {
    let changes = this.changes

    // The API doesn't currently support end_date_visibility or end_at_text
    // in post or patch requests.

    // changes.end_date_visibility = changes.end_at_text
    delete changes.end_at_text

    return changes
  }

  get attributeManifest() {
    function dealLabelMap(attrName) {
      let labelMap = {
        external_url: 'Website Address',
        fine_print_description: 'Fine Print',
        sales_type: 'Sale Type',
        end_at_text: 'End Date Text',
      }

      return labelMap[attrName] || attrName.startCase()
    }

    function defaultLabelRemove(attrName) {
      return attrName.indexOf('$') < 0 && 
        attrName.indexOf('id') < 0 &&
        attrName != 'type'
    }

    function defaultLabelMap(attrName) {
      if (attrName.indexOf('is_') === 0 ) {
        return attrName.replace('is_','').startCase() + '?'
      }
      else if (attrName.indexOf('_at') > -1 && self[attrName].constructor.name === 'Moment') {
        return attrName.replace('_at', '_date').startCase()
      }
      else if (attrName === 'seo_slug') {
        return "SEO Title"
      }
      else {
        return null
      }
    }

    let self = this;
    return _
      .chain(this.attributes)
      .keys()
      .remove(attrName => {
        return defaultLabelRemove(attrName)
      })
      .map(attrName => {
        return {
          name: attrName,
          label: defaultLabelMap(attrName) || dealLabelMap(attrName)
        }
      })
      .value()
  }
}
