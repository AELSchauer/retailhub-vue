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

  static attributeRelationships() {
    let fields = this.fields()
    return _.keys(fields).filter(key => {
      return fields[key].constructor.name != 'Attr'
    }).reduce((list, key) => {
      return _.set(list, key, fields[key])
    }, {});
  }

}
