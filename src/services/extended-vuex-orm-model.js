import _ from 'lodash'
import { Model } from '@vuex-orm/core'

export default class ExtendedModel extends Model {
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


  static relationshipFieldNames() {
    return _.keys(this.relationshipFields())
  }


  get(attrName) {
    if (_.includes(this.constructor.relationshipFieldNames(), attrName)) {
      return this[attrName].filter(r => r.id != "0")
    }
    else {
      return this[attrName]
    }
  }
}
