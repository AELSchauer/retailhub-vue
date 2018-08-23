import BaseComponent from './_base'

class BaseText extends BaseComponent {
  constructor() {
    super()

    this.icon = 'quote-right'
    this.allowsChildren = false
    this.allowedChildren = null
    this.childrenRequired = null
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      element: {
        type: 'drop-down',
        required: true,
        default: 'span',
        whitelist: this.$allWrappers
      },
      content: {
        type: 'text',
        required: true,
      },
    }
  }
}

export class Text extends BaseText {
  static entity = 'text'
};

export class NavText extends BaseText {
  static entity = 'nav_text'
}
