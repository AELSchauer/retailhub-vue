import BaseComponent from './_base'

export class NavMenu extends BaseComponent {
  static entity = 'nav_menu'

  constructor() {
    super()
  
    this.icon = 'bars'
    this.allowsChildren = true
    this.allowedChildren = [
      'nav_link',
      'nav_image',
      'nav_text'
    ]
    this.childrenRequired = false

    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      hamburger: {
        type:      'drop-down',
        required:  true,
        default:   'false',
        whitelist: [ 'true', 'false' ],
      },
    }
  }

  get displayName() {
    return 'Navigation Menu'
  }
}
