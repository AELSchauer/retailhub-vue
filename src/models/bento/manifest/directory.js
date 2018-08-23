import BaseComponent from './_base'

export class Directory extends BaseComponent {
  static entity = 'directory'

  constructor() {
    super()

    // this.icon = 'shopping-cart'
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      suppress_search: {
        type: 'drop-down',
        required: false,
        whitelist: [ 'true', 'false' ],
        default: 'false',
      },
      stores: {
        type: 'query',
        required: true,
      },
    }
  }
}
