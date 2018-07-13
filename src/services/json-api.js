import _ from 'lodash'
import pluralize from 'pluralize'

import $http from '@/backend/vue-axios/axios';
import $store from '@/store';

import Company from '@/models/company'

const singularize = pluralize.singular

export default class JsonApi {
  static findAll(args) {
    let params = ['resource']
    return this.request('findAll', args, params)
  }

  static findRecord(args) {
    let params = ['resource', 'id']
    return this.request('findRecord', args, params)
  }

  static peekRecord(args) {
    let params = ['resource', 'id']
    return this.request('peekRecord', args, params)
  }

  static deleteAssociations(args) {
    let params = ['resource', 'id', 'associatedRecords']
    return this.request('deleteAssociations', args, params)
  }

  static createAssociations(args) {
    let params = ['resource', 'id', 'associatedRecords']
    return this.request('createAssociations', args, params)
  }

  static updateRecord(args) {
    let params = [
      'resource', 'id', 'body', 'body.data', 
      'body.data.id', 'body.data.type', 'body.data.attributes'
    ]
    return this.request('updateRecord', args, params)
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
    this.body               = args.body
    this.options            = args.options || {}
  }

  peekAll() {
    return new Promise((resolve) => {
      let getRecords = $store.getters[`entities/${this.resource}/query`]()
      if (this.include && this.include.length) {
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
      if (this.include && this.include.length) {
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
          let includeQueried = `$${includeResources.pop()}_queried`
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
          let includeQueried = `$${includeResources.pop()}_queried`
          let recordChain = _record;
          includeResources.forEach(resource => {
            recordChain = recordChain[resource]
          })
          return recordChain[includeQueried]
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
          let includeQueried = `$${includeResources.pop()}_queried`
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

  createAssociations() {
    if (!this.associatedRecords.length) {
      return new Promise(() => {
        throw 'must include at least one associated record to add'
      })
    }

    try {
      return $http.request({
        method: 'post',
        url: this.url,
        headers: this.headers('post'),
        params: this.requestParams,
        data: {
          data: this.associatedRecords
        }
      })
      .then((response) => {
        if (response.status != 204) {
          throw response
        }

        $store.dispatch(`entities/deals/insertOrUpdate`, {
          data: [ _.set({ id: this.resourceId }, this.associationType, this.associatedRecords) ]
        })
      })
    }
    catch (e) {
      return e
    }
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

        let joinTableResource = [ this.resource, this.associationType ].sort()
        joinTableResource[0] = singularize(joinTableResource[0])
        joinTableResource = joinTableResource.join('-')

        this.associatedRecords.forEach(associatedRecord => {
          let resource_id = `${singularize(this.resource)}_id`
          let association_id = `${singularize(associatedRecord.type)}_id`
          $store.dispatch(`entities/${joinTableResource}/delete`, (record) => {
            return record[resource_id] === this.resourceId && record[association_id] === associatedRecord.id
          })
        })
      })
    }
    catch (e) {
      return e
    }
  }


  updateRecord() {
    return $http.request({
      method: 'patch',
      url: this.url,
      headers: this.headers('patch'),
      params: this.requestParams,
      data: this.body,
    }).then((response) => {
      if (response.status != 200) {
        throw response
      }
      let convertedData = { data: this.convertJsonToRest(response.data) }
      $store.dispatch(`entities/${this.resource}/${this.storeMethod}`, convertedData )
    }).then(() => {
      return this.peekRecord()
    })
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

    let include = formatInclude(params.include)
    if (!_.isEmpty(include)) {
      params.include = include
    }

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
    else if (_.includes(['post', 'patch', 'delete'], method)) {
      return {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    }
  }

  get url() {
    try {
      let url = `/${this.resource}`

      if (this.resourceId) {
        url = url + `/${this.resourceId}`
      }

      if (this.associationType.length) {
        url = url + `/relationships/${this.associationType}`
      }

      return url
    }
    catch(e) {
      return e
    }
  }

  get associationType() {
    if (!this.associatedRecords) {
      return []
    }

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
