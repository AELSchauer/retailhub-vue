import BaseComponent from './_base'

export class StoreDealsTabs extends BaseComponent {
  static entity = 'store_deals_tabs'

  constructor() {
    super()

    // this.icon = '????'
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
