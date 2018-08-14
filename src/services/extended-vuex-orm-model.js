import _ from 'lodash'
import moment from 'moment'
import { Model } from '@vuex-orm/core'
import ORM from '@/adapters/orm/index'

export default class ExtendedModel extends Model {
  static with(relationships) {
    return new ORM({
      resource: this.entity,
      options: {
        params: {
          include: relationships
        }
      }
    })
  }

  static find(id, options) {
    return new ORM({
      resource: this.entity,
      id:       id,
      options:  options
    }).find()
  }

  static all(options) {
    return new ORM({
      resource: this.entity,
      options:  options
    }).all()
  }

  static attributeFields() {
    let fields = this.fields()
    return _.keys(fields).filter(key => {
      return fields[key].constructor.name === 'Attr'
    }).reduce((list, key) => {
      return _.set(list, key, fields[key])
    }, {});
  }

  static relationshipFields() {
    let fields = this.fields()
    return _.keys(fields).filter(key => {
      return fields[key].constructor.name != 'Attr'
    }).reduce((list, key) => {
      return _.set(list, key, fields[key])
    }, {});
  }

  static attributeFieldNames() {
    return _.keys(this.attributeFields())
  }

  static relationshipFieldNames() {
    return _.keys(this.relationshipFields())
  }

  static dateAttributeNames() {
    return []
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

  _serializedChanges(keyMap) {
    let changes = this.changes

    _.toPairs(keyMap).forEach(([oldKey, newKey]) => {
      if (newKey) {
        changes[newKey] = changes[oldKey]
        delete changes[oldKey]
      }
      else {
        delete changes[oldKey]
      }
    })

    return changes
  }

  _attributeManifest(options) {
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
    let woot = _
      .chain(this.attributes)
      .keys()
      .remove(attrName => {
        return defaultLabelRemove(attrName)
      })
    // console.log('woot1', woot.value())
    // woot = woot
      .remove(attrName => {
        return !_.includes((options.labelRemove || []), attrName)
      })
    // console.log('woot1', woot.value())
    // woot = woot
      .map(attrName => {
        return {
          name: attrName,
          label: defaultLabelMap(attrName) || (options.labelMap || {})[attrName] || attrName.startCase()
        }
      })
    // console.log('woot3', woot.value())
    return woot
      .value()
  }
}
