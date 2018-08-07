import _ from 'lodash'
import BentoComponent from './component'
import BentoManifest from './_manifest'

export default class BentoPartial {

  constructor({name, content={ name: 'container', type: 'component' }}={}) {
    this.name    = (name || '').replace(/ /g, '-');
    this.children = new BentoComponent(content)
  }

  toJSON() {
    return {
      name:    this.name,
      content: this.children.toJSON(),
    }
  }

  get bentoManifest() {
    return BentoManifest.build('container', 'component')
  }
}
