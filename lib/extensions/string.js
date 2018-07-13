import _ from 'lodash'

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
