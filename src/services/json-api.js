import _ from 'lodash'
import pluralize from 'pluralize'

import $http from '@/backend/vue-axios/axios';
import $store from '@/store';

import Company from '@/models/company'

export default class JsonApi {
  static findAll(args) {
    let params = ['resource']
    return this.request('findAll', args, params)
  }

  static findRecord(args) {
    let params = ['resource', 'id']
    return this.request('findRecord', args, params)
  }

  static deleteAssociations(args) {
    let params = ['resource', 'id', 'associatedRecords']
    return this.request('deleteAssociations', args, params)
  }

  static request(method, args, params) {
    let argChecker = new ArgumentsChecker(args, params)
    if (argChecker.noneMissing) {
      return new JsonApi(argChecker.args)[method]()
    }
    else {
      return new Promise(() => {
        throw { 'missing arguments': argChecker.missingArgs }
      })
    }
  }

  constructor(args) {
    this.time               = Math.round(Date.now() / 1000);
    this.resource           = args.resource
    this.resourceId         = args.id
    this.associatedRecords  = args.associatedRecords
    this.options            = args.options || {}
  }

  peekAll() {
    return new Promise((resolve) => {
      let getRecords = $store.getters[`entities/${this.resource}/query`]()
      if (this.include.length) {
        this.include.split(',').forEach((resource) => {
          getRecords = getRecords.with(resource)
        })
      }
      getRecords = getRecords.all()
      resolve(getRecords)
    }) 
  }

  peekRecord() {
    return new Promise((resolve) => {
      let getRecord = $store.getters[`entities/${this.resource}/query`]()
      if (this.include.length) {
        this.include.split(',').forEach((resource) => {
          getRecord = getRecord.with(resource)
        })
      }
      getRecord = getRecord.find(this.resourceId)
      resolve(getRecord)
    }) 
  }

  findAll() {
    return this.peekAll().then((records) => {
      let allRecordsHaveAllRelationships = (_records) => {
        return _.every(this.include.split(','), i => {
          let includeResources = i.split('.')
          let includeQueried = `${includeResources.pop()}_queried`
          _.every(_records, record => {
            includeResources.forEach(resource => {
              record = record[resource]
            })
            return record[includeQueried]
          })
        })
      }

      if (records.length && allRecordsHaveAllRelationships(records)) {
        return records
      }
      return $http.request({
        method: 'get',
        url: this.url,
        headers: this.headers('get'),
        params: this.requestParams
      }).then((response) => {
        if (response.status != 200) {
          throw response
        }
        let convertedData = { data: this.convertJsonToRest(response.data) }
        $store.dispatch(`entities/${this.resource}/${this.storeMethod}`, convertedData )
      }).then(() => {
        return this.peekAll()
      })
    })
  }

  findRecord() {
    return this.peekRecord().then((record) => {
      let recordHasAllRelationships = (_record) => {
        return _.every(this.include.split(','), i => {
          let includeResources = i.split('.')
          let includeQueried = `${includeResources.pop()}_queried`
          includeResources.forEach(resource => {
            _record = _record[resource]
          })
          return _record[includeQueried]
        })
      }

      if (record && recordHasAllRelationships(record)) {
        return record
      }
      return $http.request({
        method: 'get',
        url: this.url,
        headers: this.headers('get'),
        params: this.requestParams
      }).then((response) => {
        if (response.status != 200) {
          throw response
        }
        let convertedData = { data: this.convertJsonToRest(response.data) }
        this.include.split(',').forEach(i => {
          let includeResources = i.split('.')
          let includeQueried = `${includeResources.pop()}_queried`
          convertedData.data.forEach(record => {
            includeResources.forEach(resource => {
              record = record[resource]
            })
            record[includeQueried] = true
          })
        })

        $store.dispatch(`entities/${this.resource}/${this.storeMethod}`, convertedData )
      }).then(() => {
        return this.peekRecord()
      })
    })
  }

  deleteAssociations() {
    if (!this.associatedRecords.length) {
      return new Promise(() => {
        throw 'must include at least one associated record to delete'
      })
    }

    try {
      return $http.request({
        method: 'delete',
        url: this.url,
        headers: this.headers('delete'),
        params: this.requestParams,
        data: {
          data: this.associatedRecords
        }
      })
      .then((response) => {
        if (response.status != 204) {
          throw response
        }

        this.associatedRecords.forEach(record => {
          $store.dispatch(`entities/${this.associationType}/delete`, record.id)
        })
      })
    }
    catch (e) {
      return e
    }
  }


  buildParams(params = {}) {
    function formatInclude(include = '') {
      if (_.isArray(include)) {
        include = include.join(',')
      }
      if (_.isString(include)) {
        include = include.replace(/ /g, '')
      }

      return include
    }

    // other params to support?
    //    - filter

    params.include = formatInclude(params.include)

    return params
  }

  get params() {
    return this.buildParams(this.options.params)
  }

  get include() {
    return this.params.include
  }

  get currentUser() {
    return $store.getters.currentUser
  }

  get authorizationToken() {
    return this.currentUser.authenticationToken(this.time)
  }

  get authorizationParams() {
    return {
      auth_id:        this.currentUser.id,
      auth_timestamp: this.time,
      auth_token:     this.authorizationToken,
    }
  }

  get requestParams() {
    return _.merge(this.authorizationParams, this.params)
  }

  headers(method) {
    if (_.includes(['get'], method)) {
      return {
        'Accept': 'application/vnd.api+json'
      }
    }
    else if (_.includes(['delete'], method)) {
      return {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    }
  }

  get getHeaders() {
    return {
      'Accept': 'application/vnd.api+json'
    }
  }

  get url() {
    try {
      let url = `/${this.resource}`

      if (this.resourceId) {
        url = url + `/${this.resourceId}`
      }

      if (this.associatedRecords && this.associationType.length) {
        url = url + `/relationships/${this.associationType}`
      }

      return url
    }
    catch(e) {
      return e
    }
  }

  get associationType() {
    let associationType = _
      .chain(this.associatedRecords)
      .map(record => record.type )
      .uniq()
      .value()

    if (associationType.length) {
      return associationType[0]
    }
    else {
      throw error('associated records limited to one type of association', associationType)
    }
  }

  get storeMethod() {
    let overrides = this.options.overrides || {};
    return overrides.storeMethod || 'insertOrUpdate'
  }

  convertJsonToRest(responseBody) {
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
      let relationshipRecord = responseBody.included.find(v => {
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

    let records = _.flattenDeep([responseBody.data])
    return records.map(record => {
      return convertRecord(record)
    })
  }
}

let error = (message, data) => {
  return new Promise(() => {
    throw (data) ? (_.set({}, message, data)) : (message)
  })
}

class ArgumentsChecker {
  constructor(args, required, optional=[]) {
    this.required = required
    this.optional = ['options'].concat(optional)
    this._args    = _.chain(args).pick(this.allowed)

    this.findMissingArgs()
  }

  get args() {
    return this._args.value()
  }

  get allowed() {
    return this.required.concat(this.optional)
  }

  get noneMissing() {
    return !this.missingArgs.length
  }

  findMissingArgs() {
    let args = this._args
    this.missingArgs = this.required.filter(attr => {
      return !args.has(attr).value()
    })
  }
}
