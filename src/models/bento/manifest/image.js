import BaseComponent from './_base'

class BaseImage extends BaseComponent {
  constructor() {
    super()
    
    this.icon = 'image'
    this.attributes = {
      classes: {
        type: 'text',
        required: false,
      },
      src: {
        type: 'text',
        required: true,
      },
      alt: {
        type: 'text',
        recommended: true,
      },
    }
  }
}

export class Image extends BaseImage {
  static entity = 'image'
};

export class NavImage extends BaseImage {
  static entity = 'nav_image'
}
