import _ from 'lodash'
const _wrappers = [ 'address', 'div', 'footer', 'header', 'span'];
const _textWrappers = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
const Attribute = class {
  constructor(name, data) {
    this.name = name,
    this.data = data
  }

  get manifest() {
    return this.data
  }

  get vuePath() {
    return `bento-${this.data.type}-attribute`
  }
}

export default class Manifest {
  static find(...args) {
    try {
      return this._retrieve(args).find()
    }
    catch (error) {
      return {}
    }
  }

  static build(...args) {
    try {
      return this._retrieve(args)
    }
    catch (error) {
      return {}
    }
  }

  static _retrieve([attrName, attrType]) {
    if (attrType === 'component') {
      return new Manifest(attrName)
    }
    else {
      return new Manifest(attrType)
    }
  }

  constructor (attrName) {
    this.attrName = `$${attrName}`;
  }

  find() {
    return this[this.attrName] || {};
  }

  get standardComponents() {
    return _
      .chain(Object.getOwnPropertyNames(this.__proto__))
      .filter(prop => {
        return prop != '$partial' && prop[0] === '$'
      })
      .map(prop => prop.slice(1))
      .value()
  }

  allowedComponentChildren() {
    return _
      .chain(this.find().allowedChildren)
      .filter(child => {
        return child != '$partial'
      })
      .map(child => {
        console.log('child', child)
        return Manifest.find(child, 'component')
      })
      .value();
  }

  isAllowedPartialsChildren() {
    return _.indexOf(this.find().allowedChildren, '$partial') > -1;
  }

  attributes() {
    return _.toPairs(this.find().attributes).map(([attrName, attrData]) => {
      return new Attribute(attrName, attrData)
    })
  }

  get $container() {
    return {
      name: 'container',
      allowsChildren: true,
      allowedChildren: this.standardComponents,
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        element: {
          type: 'drop-down',
          required: true,
          default: 'div',
          whitelist: _wrappers,
        },
        wrap_content: {
          type: 'drop-down',
          required: false,
          whitelist: [ 'true', 'false' ],
          default: 'false',
        }
      },
      icon: 'window-maximize',
    }
  }

  get $deals() {
    return {
      name: 'deals',
      allowsChildren: false,
      attributes:      {
        classes: {
          type: 'text',
          required: false,
        },
        deals: {
          type: 'token',
          required: true,
        },
      },
      icon: 'shopping-cart',
    }
  }

  get $image() {
    return {
      name: 'image',
      allowsChildren: false,
      attributes: {
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
      },
      icon: 'image',
    }
  }

  get $partial() {
    return {
      attributes: null,
      icon: 'chevron-right',
    }
  }

  get $text() {
    return {
      name: 'text',
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        element: {
          type: 'drop-down',
          required: true,
          default: 'span',
          whitelist: [].concat(_wrappers).concat(_textWrappers),
        },
        content: {
          type: 'rich-text',
          required: true,
        },
      },
      icon: 'quote-right',
    }
  }
}
