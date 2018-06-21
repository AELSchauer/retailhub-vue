import _ from 'lodash'
import Manifest from './_manifest'

export default class BentoComponent {
  constructor (json) {
    this.name        = json.name;
    this.type        = json.type;
    this._attributes = (json.attributes || {});
    this._children   = (json.children || {});
  }

  get attributes() {
    return [{ name: 'first' }, { name: 'second' }, { name: 'third' }]
  }

  get manifest() {
    return new Manifest.build(this.name, this.type)
  }
}
