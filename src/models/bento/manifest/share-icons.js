import BaseComponent from './_base'

export class ShareIcons extends BaseComponent {
  static entity = 'share_icons'

  constructor() {
    super()

    // this.icon = 'shopping-cart'
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
    }
  }
}
