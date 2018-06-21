import _ from 'lodash'

export default class Manifest {
  static build(attrName, attrType) {
    try {
      if (attrType === 'component') {
        return new Manifest(attrName).build()
      }
      else {
        return new Manifest(attrType).build()
      }
    } catch (_) {
      return null
    }
  }

  constructor (attrName) {
    this.attrName  = attrName;
  }

  build() {
    return _.get(this, this.attrName)
  }

  get partial() {
    return {
      attributes: null,
      icon: 'fa-chevron-right',
    }
  }
}
