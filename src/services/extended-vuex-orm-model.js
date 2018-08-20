import _ from 'lodash'
import moment from 'moment'
import { Model } from '@vuex-orm/core'
import ORM from '@/adapters/orm/index'

export default class ExtendedModel extends Model {
  static with(relationships) {
    return new ORM({
      resource: this.entity,
      options: {
        params: {
          include: relationships
        }
      }
    })
  }

  static find(id, options) {
    return new ORM({
      resource: this.entity,
      id:       id,
      options:  options
    }).find()
  }

  static all(options) {
    return new ORM({
      resource: this.entity,
      options:  options
    }).all()
  }

  static new() {
    let newObj = new this
    return new Promise(resolve => {
      newObj.snapshot()
      resolve(newObj)
    })
  }

  static attributeFields() {
    let fields = this.fields()
    return _
      .keys(fields).filter(key => {
        return fields[key].constructor.name === 'Attr'
      })
      .reduce((list, key) => {
        return _.set(list, key, fields[key])
      }, {});
  }

  static relationshipFields() {
    let fields = this.fields()
    return _
      .keys(fields).filter(key => {
        return fields[key].constructor.name != 'Attr'
      })
      .reduce((list, key) => {
        return _.set(list, key, fields[key])
      }, {});
  }

  static attributeFieldNames() {
    return _.keys(this.attributeFields())
  }

  static relationshipFieldNames() {
    return _.keys(this.relationshipFields())
  }

  static dateAttributeNames() {
    return []
  }

  save(options) {
    return new ORM({
      resource: this.type,
      id:       this.id,
      changes:  this.serializedChanges(),
      options:  options
    }).save()
  }

  get(attr) {
    if (_.includes(this.constructor.dateAttributeNames(), attr)) {
      return moment.utc(_.get(this, attr))
    }
    else {
      return _.get(this, attr)
    }
  }

  set(attr, newValue) {
    let dateAttributeNames = this.constructor.dateAttributeNames()

    function format(attr, value) {
      if (attr === 'seo_slug') {
        return value.slugify()
      }
      else if (_.includes(dateAttributeNames, attr)) {
        return moment.utc(value).format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        return value
      }
    }

    // _.set(this, attr, format(attr, newValue))
    this[attr] = format(attr, newValue)
  }

  get attributes() {
    let self = this;
    return this.constructor.attributeFieldNames().reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  get relationships() {
    let self = this;
    return this.constructor.relationshipFieldNames().reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  snapshot() {
    this.snapshot = {
      attributes: _.cloneDeep(this.attributes),
      relationships: _.cloneDeep(this.relationships)
    }
  }

  rollback() {
    let self = this
    _.keys(this.snapshot).forEach(k => {
      self[k] = self.snapshot[k]
    })
  }

  get changes() {
    let self = this
    let snapshot = this.snapshot
    let changes = { attributes: {}, relationships: {} }
    _.toPairs(snapshot.attributes).forEach(([ key, oldVal ]) => {
      let newVal = self[key]

      if (_.includes(self.constructor.dateAttributeNames(), key)) {
        function formatDate(val) {
          if(val) {
            val = moment.utc(val)
            if (val.isValid()) {
              val = val.format('YYYY-MM-DD HH:mm')
            }
          }
          return val
        }

        oldVal = formatDate(oldVal)
        newVal = formatDate(newVal)
      }

      if (newVal != oldVal) {
        _.set(changes.attributes, key, newVal)
      }
    })

    _.toPairs(snapshot.relationships).forEach(([ key, oldVal ]) => {
      let newVal = _.get(self, key)

      if (_.isArray(newVal)) {
        let oldIds = oldVal.map(v => v.id),
            newIds = newVal.map(v => v.id),
            match = _.every(newIds, id => {
              return _.includes(oldIds, id)
            })

        if (!match) {
          _.set(changes.relationships, key, newVal)
        }
      }
      else if (_.get(newVal, 'id') != _.get(oldVal, 'id')) {
        _.set(changes.relationships, key, newVal)
      }
    })

    return changes
  }

  serializedChanges() {
    let changes = {},
        attributes = this.serializedAttributes(),
        relationships = this.serializedRelationships()

    if (attributes) {
      _.set(changes, 'attributes', attributes)
    }

    if (relationships) {
      _.set(changes, 'relationships', relationships)
    }

    return changes
  }

  serializedAttributes() {
    let keyMap = this.serializationKeyMap || {}
    let attributes = this.changes.attributes

    _.toPairs(keyMap).forEach(([oldKey, newKey]) => {
      if (newKey) {
        attributes[newKey] = attributes[oldKey]
        delete attributes[oldKey]
      }
      else {
        delete attributes[oldKey]
      }
    })

    return attributes
  }

  serializedRelationships() {
    let relationships = this.changes.relationships

    return _.toPairs(relationships).reduce((json, [ name, relationship ]) => {
      let data
      if (_.isArray(relationship)) {
        data = relationship.map(r => {
          return {
            id: r.id,
            type: r.type
          }
        })
      }
      else {
        data = {
          id: relationship.id,
          type: relationship.type
        }
      }

      return _.set(json, name, { data: data })
    }, {})
  }

  _attributeManifest(options) {
    function defaultLabelRemove(attrName) {
      return attrName.indexOf('$') < 0 && 
        attrName.indexOf('id') < 0 &&
        attrName != 'type'
    }

    function defaultLabelMap(attrName) {
      if (attrName.indexOf('is_') === 0 ) {
        return attrName.replace('is_','').startCase() + '?'
      }
      else if (attrName.indexOf('_at') > -1 && self[attrName].constructor.name === 'Moment') {
        return attrName.replace('_at', '_date').startCase()
      }
      else if (attrName === 'seo_slug') {
        return "SEO Title"
      }
      else {
        return null
      }
    }

    let self = this;
    let woot = _
      .chain(this.attributes)
      .keys()
      .remove(attrName => {
        return defaultLabelRemove(attrName)
      })
    // console.log('woot1', woot.value())
    // woot = woot
      .remove(attrName => {
        return !_.includes((options.labelRemove || []), attrName)
      })
    // console.log('woot1', woot.value())
    // woot = woot
      .map(attrName => {
        return {
          name: attrName,
          label: defaultLabelMap(attrName) || (options.labelMap || {})[attrName] || attrName.startCase()
        }
      })
    // console.log('woot3', woot.value())
    return woot
      .value()
  }
}
