import _ from 'lodash'
const _wrappers = [ 'address', 'div', 'footer', 'header', 'span'];
const _textWrappers = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

export default class Manifest {
  static find(attrName, attrType) {
    try {
      if (attrType === 'component') {
        return new Manifest(attrName).build()
      }
      else {
        return new Manifest(attrType).build()
      }
    } catch (error) {
      return {}
    }
  }

  constructor (attrName) {
    this.attrName  = attrName;
  }

  build() {
    return (_.get(this, this.attrName) || {})
  }

  get container() {
    return {
      allows_children: true,
      allowed_children: [
        // 'carousel',
        'container',
        'deals',
        'directory',
        'if',
        'image',
        'link-to',
        'nav-menu',
        'share-icons',
        'text',
      ],
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        element: {
          type:      'drop-down',
          required:  true,
          default:   'div',
          whitelist: _wrappers,
        },
        wrap_content: {
          type:      'drop-down',
          required:  false,
          whitelist: [ 'true', 'false' ],
          default:   'false',
        }
      },
      icon: 'fa-window-maximize',
    }
  }

  get image() {
    return {
      allows_children: false,
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        src: {
          type:     'text',
          required: true,
        },
        alt: {
          type:        'text',
          recommended: true,
        },
      },
      icon: 'fa-image',
    }
  }

  get partial() {
    return {
      attributes: null,
      icon: 'fa-chevron-right',
    }
  }
}
