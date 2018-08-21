import _ from 'lodash'
import moment from 'moment'
import { Model } from '@vuex-orm/core'
import {  singularRelationships,
          pluralRelationships,
          unknownRelationships } from './utils'
import ORM from './index'

export default class ExtendedOrmModel extends Model {
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

  static _attributeFields() {
    let fields = this.fields()
    return _
      .keys(fields).filter(key => {
        return fields[key].constructor.name === 'Attr'
      })
      .reduce((list, key) => {
        return _.set(list, key, fields[key])
      }, {});
  }

  static _relationshipFields() {
    let fields = this.fields()
    return _
      .keys(fields).filter(key => {
        return fields[key].constructor.name != 'Attr'
      })
      .reduce((list, key) => {
        return _.set(list, key, fields[key])
      }, {});
  }

  save(options) {
    return new ORM({
      resource: this.type,
      id:       this.id,
      record:   this,
      options:  options
    }).save()
  }

  get attributes() {
    let self = this;
    let attributeFieldNames = _.keys(this.constructor._attributeFields())
    return attributeFieldNames.reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  get relationships() {
    let self = this;
    let relationshipFieldNames = _.keys(this.constructor._relationshipFields())
    return relationshipFieldNames.reduce((json, key) => {
      return _.set(json, key, self[key])
    }, {});
  }

  snapshot() {
    this._snapshot = {
      attributes: _.cloneDeep(this.attributes),
      relationships: _.cloneDeep(this.relationships)
    }
  }

  rollback() {
    let self = this
    _.keys(this._snapshot).forEach(k => {
      self[k] = self.snapshot[k]
    })
  }

  _isChanged(attrName, oldVal, newVal) {
    let relationshipFields = this.constructor._relationshipFields()

    function isPluralRelationship(attrName) {
      return _
        .chain(relationshipFields)
        .map((field, name) => {
          if (_.includes(pluralRelationships, field.constructor.name)) {
            return name
          }
        })
        .compact()
        .includes(attrName)
        .value()
    }

    function isSingularRelationship(attrName) {
      return _
        .chain(relationshipFields)
        .map((field, name) => {
          if (_.includes(singularRelationships, field.constructor.name)) {
            return name
          }
        })
        .compact()
        .includes(attrName)
        .value()
    }

    function isUnknownRelationship(attrName) {
      return _
        .chain(relationshipFields)
        .map((field, name) => {
          if (_.includes(unknownRelationships, field.constructor.name)) {
            return name
          }
        })
        .compact()
        .includes(attrName)
        .value()
    }

    if (isPluralRelationship(attrName)) {
      let oldIds = oldVal.map(v => v.id).sort().join(','),
          newIds = newVal.map(v => v.id).sort().join(',')
      return oldIds != newIds
    }
    else if (isSingularRelationship(attrName)) {
      return _.get(newVal, 'id') != _.get(oldVal, 'id')
    }
    else if (isUnknownRelationship(attrName)){
      console.error('ERROR -- the relationship type for this attribute has not been identified as plural or singular', attrName)
    }
    else {
      return oldVal != newVal
    }
  }

  _formatChanged(attrName, newVal) {
    return newVal
  }

  get changes() {
    let self = this
    let snapshot = this._snapshot
    let changes = { attributes: {}, relationships: {} }

    _.toPairs(snapshot.attributes).forEach(([ attrName, oldVal ]) => {
      let newVal = _.get(self, attrName)
      let isChanged = self._isChanged(attrName, oldVal, newVal)

      if (isChanged) {
        let formattedChanged = self._formatChanged(attrName, newVal)
        _.set(changes.attributes, attrName, formattedChanged)
      }
    })

    _.toPairs(snapshot.relationships).forEach(([ attrName, oldVal ]) => {
      let newVal = _.get(self, attrName)
      let isChanged = self._isChanged(attrName, oldVal, newVal)

      if (isChanged) {
        let formattedChanged = self._formatChanged(attrName, newVal)
        _.set(changes.relationships, attrName, formattedChanged)
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
}
