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
    return (attrType === 'component') ? (new Manifest(attrName)) : new Manifest(attrType)
  }

  constructor (attrName) {
    this.attrName = `$${attrName}`;
  }

  find() {
    return this[this.attrName] || {};
  }

  allowedComponentChildren() {
    return _
      .chain(this.find().allowedChildren)
      .filter(child => {
        return child != '$partial'
      })
      .map(child => {
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
      icon: 'window-maximize',
      allowsChildren: true,
      allowedChildren: this.standardComponents.concat('$partial'),
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
    }
  }

  get 'meta-container'() {
    return {
      standardComponent: true,
    }
  }


  get $deals() {
    return {
      name: 'deals',
      icon: 'shopping-cart',
      allowsChildren: false,
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        deals: {
          type: 'query',
          required: true,
        },
      },
    }
  }

  get 'meta-deals'() {
    return {
      standardComponent: true,
    }
  }


  get $if() {
    return {
      name: 'if',
      icon: 'balance-scale',
      allowsChildren: true,
      childrenRequired: true,
      allowedChildren: this.standardComponents,
      attributes: {
        operator: {
          type: 'drop-down',
          required: true,
          whitelist: [ 'present', 'not-present' ],
        },
      },
    }
  }

  get 'meta-if'() {
    return {
      standardComponent: true,
    }
  }


  get $image() {
    return {
      name: 'image',
      icon: 'image',
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
    }
  }

  get 'meta-image'() {
    return {
      standardComponent: true,
    }
  }

  get '_link-to'() {
    return {
      icon: 'link',
      allowsChildren: true,
      childrenRequired: true,
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        href: {
          type: 'text',
          required: false,
        },
        id: {
          type: 'text',
          required: false,
        },
      },
    }
  }
  get '$link-to'() {
    return _
    .chain({
      name: 'link',
      allowedChildren: [
        'container',
        'image',
        'text',
      ],
    })
    .merge(this['_link-to'])
    .value()
  }

  get 'meta-link-to'() {
    return {
      standardComponent: true,
    }
  }

  get '$nav-link'() {
    return _
    .chain({
      name: 'nav link',
      allowedChildren: [
        'image',
        'text',
      ],
    })
    .merge(this['_link-to'])
    .value()
  }

  get 'meta-nav-link'() {
    return {
      standardComponent: false,
    }
  }

  get '$nav-menu'() {
    return {
      name: 'nav menu',
      icon: 'bars',
      allowsChildren: true,
      childrenRequired: true,
      allowedChildren: [
        'nav-link',
      ],
      attributes: {
        classes: {
          type: 'text',
          required: false,
        },
        hamburger: {
          type: 'drop-down',
          required: true,
          default: 'false',
          whitelist: [ 'true', 'false' ],
        },
      },
    }
  }

  get 'meta-nav-menu'() {
    return {
      standardComponent: true,
    }
  }

  get $partial() {
    return {
      icon: 'chevron-right',
      attributes: null,
    }
  }

  get $text() {
    return {
      name: 'text',
      icon: 'quote-right',
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
          type: 'text',
          required: true,
        },
      },
    }
  }

  get 'meta-text'() {
    return {
      standardComponent: true,
    }
  }


  allComponentNames() {
    return _
      .chain(Object.getOwnPropertyNames(this.__proto__))
      .filter(prop => {
        return prop != '$partial' && prop[0] === '$'
      })
      .map(prop => prop.slice(1))
      .value()
  }

  get standardComponents() {
    let self = this;
    return this.allComponentNames().filter(name => {
      let metaName = 'meta-' + name
      return self[metaName] && self[metaName].standardComponent
    })
  }
}
