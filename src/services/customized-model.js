import _ from 'lodash'
import moment from 'moment'
import ExtendedOrmModel from '@/adapters/orm/extended-orm-model'

export default class CustomModel extends ExtendedOrmModel {
  static get dateAttributeNames() {
    return []
  }
  static get serializationKeyMap() {
    return {}
  }
  static get attributeLabelMap() {
    return {}
  }

  get(attr) {
    if (_.includes(this.constructor.dateAttributeNames, attr)) {
      return moment.utc(_.get(this, attr))
    }
    else {
      return _.get(this, attr)
    }
  }

  set(attr, newValue) {
    let dateAttributeNames = this.constructor.dateAttributeNames

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

    _.set(this, attr, format(attr, newValue))
  }

  _isChanged(attrName, oldVal, newVal) {
    if (_.includes(this.constructor.dateAttributeNames, attrName)) {
      return formatDate(oldVal) != formatDate(newVal)
    }
    else {
      return super._isChanged(attrName, oldVal, newVal)
    }
  }

  _formatChanged(attrName, newVal) {
    if (_.includes(this.constructor.dateAttributeNames, attrName)) {
      return formatDate(newVal)
    }
    else {
      return super._formatChanged(attrName, newVal)
    }
  }


  get attributeManifest() {
    let options = { labelMap: this.constructor.attributeLabelMap }
    let dateAttributeNames = this.constructor.dateAttributeNames

    function defaultLabelRemove(attrName) {
      return attrName.indexOf('$') < 0 && 
        attrName.indexOf('id') < 0 &&
        attrName != 'type'
    }

    function defaultLabelMap(attrName) {
      if (attrName.indexOf('is_') === 0 ) {
        return attrName.replace('is_','').startCase() + '?'
      }
      else if (_.includes(dateAttributeNames, attrName)) {
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
      .remove(attrName => {
        return !_.includes((options.labelRemove || []), attrName)
      })
      .map(attrName => {
        return {
          name: attrName,
          label: defaultLabelMap(attrName) || (options.labelMap || {})[attrName] || attrName.startCase()
        }
      })
      .value()
  }
}

function formatDate(val) {
  if(val) {
    val = moment.utc(val)
    if (val.isValid()) {
      val = val.format('YYYY-MM-DD HH:mm')
    }
  }
  return val
}
