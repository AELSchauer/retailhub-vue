import _ from 'lodash'
import Manifest from './_manifest'

let Attribute = class {
  constructor(name, data) {
    this.name = name,
    this.data = data
  }

  get vuePath() {
    return `bento-${this.data.type}-attribute`
  }
}

export default class BentoComponent {
  constructor(json={}) {
    this.name       = json.name;
    this.type       = json.type;
    this.attributes = (json.attributes || {});
    this.children   = (json.children || []).map(component => {
                        return new BentoComponent(component)
                      });
  }

  toJSON() {
    return {
      name:       this.name,
      type:       this.type,
      attributes: this.attributes,
      children:   this.children.map(child => child.toJSON())
    }
  }

  get manifest() {
    return Manifest.find(this.name, this.type)
  }

  get manifestAttributes() {
    let manifestAttributes = (this.manifest.attributes || {});
    return Object.entries(manifestAttributes).map((kv) => {
      return new Attribute(kv[0], kv[1])
    })
  }
}
