import BaseComponent from './_base'

export class Deals extends BaseComponent {
  static entity = 'deals'

  constructor() {
    super()

    this.icon = 'shopping-cart'
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      deals: {
        type: 'query',
        required: true,
      },
    }
  }
}
