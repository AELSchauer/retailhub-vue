import _ from 'lodash'
import $store from '@/store';

export default class ORM {
  constructor({ ...args }) {
    this.resource          = args.resource
    this.id                = args.id
    this.record            = args.record
    this.options           = args.options || {}
    this.associatedRecords = args.associatedRecords
  }

  find() {
    return this.query().find(this.id)
  }

  all() {
    return this.query().all()
  }

  query() {
    let include = _.get(this.options, 'params.include');
    let getRecord = $store.getters[`entities/${this.resource}/query`]()
    if (include) {
      include.split(',').forEach((resource) => {
        getRecord = getRecord.with(resource)
      })
    }
    return getRecord
  }

  commit(response) {
    let convertedData
    if (response) {
      convertedData = this._convertResponseBody(response.data)
    }
    else if (this.record) {
      convertedData = this._convertChanges(this.record.changes)
      this._resetChangedJoinsTables()
    }
    $store.dispatch(`entities/${this.resource}/${this._storeMethod}`, convertedData)
  }

  isResourceQueried() {
    return $store.getters[`entities/${this.resource}/isQueried`]
  }

  markResourceAsQueried() {
    $store.dispatch(`entities/${this.resource}/markAsQueried`)
  }

  _convertResponseBody(body) {
    let include = _
      .chain(this.options)
      .get('params.include', '')
      .split(',')
      .compact()
      .map(i => {
        return i.split('.')
      })
      .compact()
      .value()

    return { data: convertJsonToOrmRest(body, include) }
  
    function convertJsonToOrmRest(body) {
      let records = _
        .chain([body.data])
        .flattenDeep()
        .map(record => {
          return convertRecord(record)
        })
        .value()

      if (include.length) {
        include.forEach(resource => {
          records.forEach(record => {
            markRelatedRecordsAsQueried(resource, record)
          })
        })
      }

      return records
    }

    function convertRecord(record) {
      return _
        .chain({ id: record.id })
        .merge(record.attributes)
        .merge(convertRelationships(record.relationships))
        .value()
    }

    function convertRelationships(records = []) {
      return _
        .chain(records)
        .reduce((result, value, key) => {
            result[key] = convertRelationship(value.data)
            return result;
          }, {})
        .value()
    }

    function convertRelationship(value) {
      if (value === undefined) {
        return undefined
      }
      else if (_.isArray(value)) {
        return convertPluralRelationship(value)
      }
      else if (_.isObject(value)) {
        return convertSingularRelationship(value)
      }
    }

    function convertSingularRelationship(value) {
      let relationshipRecord = body.included.find(v => {
        return value.id === v.id && value.type === v.type
      })
      return convertRecord(relationshipRecord)
    }

    function convertPluralRelationship(value) {
      return _
        .chain(value)
        .filter(v => v)
        .sort()
        .map(v => convertSingularRelationship(v))
        .value()
    }


    function markRelatedRecordsAsQueried(resource, record) {
      let nestedResource = resource.splice(1)
      resource = resource[0]

      if (nestedResource.length) {
        if (resource.isPlural()) {
          record[resource].forEach(record => {
            markRelatedRecordsAsQueried(nestedResource, record)
          })
        }
        else if (resource.isSingular()) {
          markRelatedRecordsAsQueried(nestedResource, record[resource])
        }
      }
      else {
        let includeQueried = `$${resource}_queried`
        _.set(record, includeQueried, true)
      }
    }
  }

  _convertChanges(changes) {
    let data = { id: this.id }
    _.merge(data, changes.attributes)
    _.merge(data, changes.relationships)
    _.keys(changes.relationships).forEach((relationshipName) => {
      _.set(data, `$${relationshipName}_queried`, true)
    })

    return { data: data }
  }

  _resetChangedJoinsTables(records) {
    let resource = this.resource
    let id = this.id
    let record = this.record
    let relationshipAttributes = record.constructor._relationshipFields()
    let joinsTablesToReset = _
      .chain(record)
      .get('changes.relationships', {})
      .keys()
      .filter(relationshipName => {
        let relationship = _.get(relationshipAttributes, relationshipName)
        return relationship.constructor.name === 'BelongsToMany'
      })
      .map(relationshipName => {
        let joinRelationship = [ relationshipName, resource ].sort()
        joinRelationship[0] = joinRelationship[0].singularize()
        return joinRelationship.join('-')
      })
      .value()

    let idAttr = `${resource.singularize()}_id`
    joinsTablesToReset.forEach(joinTable => {
      $store.dispatch(`entities/${joinTable}/delete`, (record) => {
        return record[idAttr] === id
      })
    })
  }

  get _storeMethod() {
    return _.get(this.options, 'overrides.storeMethod') || 'insertOrUpdate'
  }
}
