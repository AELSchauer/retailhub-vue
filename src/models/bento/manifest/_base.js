import _ from 'lodash'

export default class _Base {
  static entity = ''

  constructor() {
    this.name = this.constructor.entity
    this.icon = ''
    this.allowsChildren = false
    this.allowedChildren = null
    this.childrenRequired = null
    this.attributes = null
  }
  
  get displayName() {
    return this.name.startCase()
  }

  get isPartialAllowedChild() {
    return this.allowsChildren && _.includes(this.allowedChildren, 'partial')
  }

  get $standardComponents() {
    return [
      'container',
      'deals',
      'directory',
      'if',
      'image',
      'link_to',
      'nav_menu',
      'share_icons',
      'store_deals_tabs',
      'text',
    ]
  }

  get $standardComponentsAndPartials() {
    return this.$standardComponents.push('partial')
  }

  get $containerWrappers() {
    return [ 'address', 'div', 'footer', 'header', 'span'];
  }

  get $textWrappers() {
    return [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
  }

  get $allWrappers() {
    return this.$containerWrappers.concat(this.$textWrappers)
  }
}
