import ComponentLoader from './_component-loader'

class Attribute {
  constructor(name, data) {
    this.name = name,
    this.data = data
  }

  get manifest() {
    return this.data
  }

  get vuePath() {
    return `bento-${this.data.type}-attribute`
  }
}

export default class Manifest {
  static find(attrName, attrType) {
    try {
      return new Manifest(attrName, attrType).find()
    }
    catch (error) {
      return {}
    }
  }

  static build(attrName, attrType) {
    try {
      return new Manifest(attrName, attrType)
    }
    catch (error) {
      return {}
    }
  }

  constructor (attrName, attrType) {
    this.attrName = attrName
    this.attrType = attrType
  }

  find() {
    if (this.attrType === 'component') {
      return new ComponentLoader(this.attrName);
    }
    else {
      return new ComponentLoader(this.attrType, this.attrName);
    }
  }

  allowedComponentChildren() {
    return _
      .chain(this.find())
      .get('allowedChildren' || [])
      .filter(child => {
        return child != 'partial'
      })
      .map(child => {
        return Manifest.find(child, 'component')
      })
      .value();
  }

  isPartialAllowedChild() {
    return this.find().isPartialAllowedChild
  }

  attributes() {
    return _
      .chain(this.find())
      .get('attributes', {})
      .toPairs()
      .map(([ attrName, attrData ]) => {
        return new Attribute(attrName, attrData)
      })
      .value()
  }
}
