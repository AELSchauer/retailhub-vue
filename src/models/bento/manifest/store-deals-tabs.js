import BaseComponent from './_base'

export class StoreDealsTabs extends BaseComponent {
  static entity = 'store-deals-tabs'

  constructor() {
    super()

    // this.icon = 'shopping-cart'
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      title: {
        type: 'text',
        required: false,
        default: 'default',
      },
    }
  }

}
