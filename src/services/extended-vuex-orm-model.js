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

  static attributeFieldNames() {
    return _.keys(this.attributeFields())
  }

  static relationshipFieldNames() {
    return _.keys(this.relationshipFields())
  }
}
