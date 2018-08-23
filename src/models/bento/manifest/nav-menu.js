import BaseComponent from './_base'

export class NavMenu extends BaseComponent {
  static entity = 'nav_menu'

  constructor() {
    super()
  
    // this.icon = 'shopping-cart'
    this.allowsChildren = true
    this.allowedChildren = [
      'nav-link',
      'nav-image',
      'nav-text'
    ]
    this.childrenRequired = false

    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
    }

    this.displayName = 'Navigation Menu'
  }
}
