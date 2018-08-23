import BaseComponent from './_base'

export class Container extends BaseComponent {
  static entity = 'container'

  constructor() {
    super()

    this.icon = 'window-maximize'
    this.allowsChildren = true
    this.allowedChildren = this.standardComponentsAndPartials
    this.childrenRequired = false
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      element: {
        type: 'drop-down',
        required: true,
        default: 'div',
        whitelist: this.$containerWrappers,
      },
      wrap_content: {
        type: 'drop-down',
        required: false,
        whitelist: [ 'true', 'false' ],
        default: 'false',
      }
    }
  }
}
