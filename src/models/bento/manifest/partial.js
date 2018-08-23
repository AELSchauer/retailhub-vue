import BaseComponent from './_base'

export class Partial extends BaseComponent {
  static entity = 'partial'

  constructor(partialName) {
    super()

    this.icon = 'chevron-right'
    this.displayName = partialName
  }
}
