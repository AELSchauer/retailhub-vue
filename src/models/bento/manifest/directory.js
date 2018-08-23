import BaseComponent from './_base'

export class Directory extends BaseComponent {
  static entity = 'directory'

  constructor() {
    super()

    this.icon = 'book'
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
      map_src: {
        type: 'text',
        required: false,
      },
      stores: {
        type: 'query',
        required: true,
      },
    }
  }
}
