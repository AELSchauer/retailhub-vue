import _ from 'lodash'
import { mergeDeep } from './utils'
import JsonApi from './json-api'
import DataStore from './data-store'

export default class ORM {
  constructor({ ...args }) {
    this.resource          = args.resource
    this.id                = args.id
    this.options           = args.options || {};
    this.associatedRecords = args.associatedRecords
    this.body              = args.body
    this.options           = args.options || {}
  }

  find(id, options={}) {
    this.id = id || this.id
    this.options = mergeDeep(this.options, options)
    this._processOptions()

    let request = {
      resource: this.resource,
      id:       this.id,
      options:  this.options
    }

    let _store = new DataStore(request)
    let record = _store.find()
    if (record && this._recordsHaveQueriedAllIncluded(record)) {
      return new Promise((resolve) => {
        resolve(record)
      })
    }

    return new JsonApi(request).find()
      .then(response => {
        if (response.status != 200) {
          throw response
        }
        else {
          _store.commit(response)
        }
      })
      .then(() => {
        return _store.find()
      })
  }

  all(options={}) {
    this.options = mergeDeep(this.options, options)
    this._processOptions()

    let request = {
      resource: this.resource,
      options:  this.options
    }

    let _store = new DataStore(request)
    if (_store.isResourceQueried()) {
      return new Promise((resolve) => {
        resolve(_store.all())
      })
    }

    return new JsonApi(request).all()
      .then(response => {
        if (response.status != 200) {
          throw response
        }
        else {
          _store.commit(response)
          _store.markResourceAsQueried()
        }
      })
      .then(() => {
        return _store.all()
      })
  }

  _processOptions() {
    let options = this.options
    let include = _.get(options, 'params.include')

    function formatInclude(include) {
      if (!include) {
        return false
      }
      else if (_.isArray(include)) {
        return _
          .chain(include)
          .compact()
          .join(',')
          .value()
      }
      else if (_.isString(include)) {
        return _
          .chain(include)
          .replace(/ /g, '')
          .value()
      }
    }

    // other params to support?
    //    - filter

    include = formatInclude(include)
    if (include) {
      _.set(options, 'params.include', include)
    }

    this.options = options
  }

  _recordsHaveQueriedAllIncluded(recordOrRecords) {
    let records = _.flatten([ recordOrRecords ])

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

      return _.every(records, record => {
        return _.every(include, resource => {
          return isIncludedQueried(resource, record)
        })
      })

    function isIncludedQueried(resource, record) {
      let nestedResource = resource.splice(1)
      resource = resource[0]

      if (nestedResource.length) {
        if (resource.isPlural()) {
          return _.every(record[resource], record => {
            return isIncludedQueried(nestedResource, record)
          })
        }
        else if (resource.isSingular()) {
          return isIncludedQueried(nestedResource, record[resource])
        }
      }
      else {
        return _.get(record, `$${resource}_queried`)
      }
    }
  }
}
