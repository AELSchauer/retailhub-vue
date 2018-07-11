import _ from 'lodash'

export default class Changeset {
  constructor (args = {}) {
    this.record = args.record
    this.changed  = {};
    this.snapshot = null;

  }

  get record() {
    return this._record
  }

  set record(model) {
    this._record = model || {};

    if (model) {
      let self = this
      this.record.constructor.attributeFieldNames().forEach(attr => {
        Object.defineProperty(this, attr, {
          get() {
            return self.get(attr);
          },
          set(newValue) {
            self.set(attr, newValue)
          },
        });
      })
    }
  }

  get(attrName) {
    return this.changed[attrName] || this.record[attrName] || false;
  }

  set(attrName, newValue) {
    this.changed[attrName] = newValue;
  }

  snapshot() {
    this.snapshot = _.deepClone(this.changed);
  }

  save() {
    console.log('save the changeset', this.changed)
    // this.record.save()
  }
}
