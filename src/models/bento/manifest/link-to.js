import BaseComponent from './_base'

class BaseLink extends BaseComponent {
  constructor() {
    super()

    this.icon = 'link'
    this.allowsChildren = true
    this.allowedChildren = [
      'container',
      'image',
      'text'
    ]
    this.childrenRequired = true

    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      href: {
        type: 'text',
        required: false,
      },
      id: {
        type: 'text',
        required: false,
      },
    }

    this.displayName = 'Link'
  }
}

export class Link extends BaseLink {
  static entity = 'link_to'
};

export class NavLink extends BaseLink {
  static entity = 'nav_link'

  constructor() {
    super()
    this.allowedChildren = [
      'nav-image',
      'nav-text'
    ]
  }
}
