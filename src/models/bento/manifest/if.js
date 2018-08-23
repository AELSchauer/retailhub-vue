import BaseComponent from './_base'

export class If extends BaseComponent {
  static entity = 'if'

  constructor() {
    super()

    this.icon = 'balance-scale'
    this.allowsChildren = true
    this.allowedChildren = this.$standardComponentsAndPartials
    this.childrenRequired = true
    this.attributes = {
      operator: {
        type: 'drop-down',
        required: true,
        whitelist: [ 'present', 'not-present' ],
      }
    }
  }
}
