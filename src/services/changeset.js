import _ from 'lodash'

export default class Changeset {
  constructor (record) {
    this.original  = record;
    this.changeset = _.chain({});
    this.snapshot  = null;
  }

  get(attrName) {
    return this.changeset.get(attrName) || this.record[attrName];
  }

  set(attrName, newValue) {
    this.changeset.set(attrName, newValue);
  }

  snapshot() {
    this.snapshot = this.changeset.deepClone();
  }

  save() {
    console.log('save the changeset', this.changeset.value())
    // this.record.save()
  }
}
