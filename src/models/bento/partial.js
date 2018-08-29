import _ from 'lodash'
import BentoComponent from './component'
import BentoManifest from './manifest/index'

 export default class BentoPartial {
   constructor({ name, content }) {
    this.name    = (name || '').replace(/ /g, '-');

    content = content || { name: 'container', type: 'component' };
    this.content = new BentoComponent(content)
  }

  get(attrName) {
    return _.get(this, attrName)
  }

  set(attrName, newValue) {
    return _.set(this, attrName, newValue)
  }

  toJSON() {
    return {
      name:    this.name,
      content: this.content.toJSON(),
    }
  }

  get bentoManifest() {
    return BentoManifest.build('container', 'component')
  }
}
