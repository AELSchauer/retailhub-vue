import _ from 'lodash'
import BentoManifest from './manifest/index'

export default class BentoComponent {

  constructor({name, type, meta={}, attributes={}, children=[]}={}) {
    this.name       = (name || '').replace(/ /g, '-');
    this.type       = type;
    this.meta       = (meta || {});
    this.attributes = (attributes || {});
    this.children   = (children || []).map(component => {
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

  get bentoManifest() {
    return BentoManifest.build(this.name, this.type)
  }
}
