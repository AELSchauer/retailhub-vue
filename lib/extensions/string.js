import _ from 'lodash'
import pluralize from 'pluralize'

Object.defineProperty(String.prototype, 'slugify', {
    value() {
      return this
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .replace(/\?+$/, '');
    }
});

Object.defineProperty(String.prototype, 'capitalize', {
    value() {
      return this.charAt(0).toUpperCase() + this.slice(1)
    }
});

Object.defineProperty(String.prototype, 'camelCase', {
    value() {
      return _.camelCase(this)
    }
});

Object.defineProperty(String.prototype, 'startCase', {
    value() {
      return _.startCase(this)
    }
});

Object.defineProperty(String.prototype, 'pluralize', {
    value() {
      return pluralize(this)
    }
});

Object.defineProperty(String.prototype, 'singularize', {
    value() {
      return pluralize.singularize(this)
    }
});

Object.defineProperty(String.prototype, 'isSingular', {
    value() {
      return pluralize.isSingular(this)
    }
});

Object.defineProperty(String.prototype, 'isPlural', {
    value() {
      return pluralize.isPlural(this)
    }
});

