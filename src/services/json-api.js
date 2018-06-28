import _ from 'lodash'
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

  findAll() {
    return $http.request({
      method: 'get',
      url: this.url,
      headers: this.getHeaders,
      params: this.params
    }).then((response) => {
      if (response.status != 200) {
        throw response
      }
      let convertedData = this.convertJsonToRest(response.data)
      $store.dispatch(`entities/${this.resource}/${this.storeMethod}`, { data: convertedData } )
    })
  }

  peekRecord() {
    return new Promise((resolve) => {
      let getRecord = $store.getters[`entities/${this.resource}/query`]()
      if (this.includeRelationships) {
        this.includeRelationships.forEach((resource) => {
          getRecord = getRecord.with(resource)
        })
      }
      getRecord = getRecord.find(this.resourceId)
      resolve(getRecord)
    }) 
  }

  findRecord() {
    return this.peekRecord().then((record) => {
      let recordHasAllRelationships = _.every(this.includeRelationships, include => record && !!record[include].length)
      if (record && recordHasAllRelationships) {
        return record
      }
      return $http.request({
        method: 'get',
        url: this.url,
        headers: this.getHeaders,
        params: this.params
      }).then((response) => {
        if (response.status != 200) {
          throw response
        }
        let convertedData = this.convertJsonToRest(response.data)
        $store.dispatch(`entities/${this.resource}/${this.storeMethod}`, { data: convertedData } )
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
        params: this.params,
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

  get includeRelationships() {
    return _.flatten([ this.options.params.include.split(',') ])
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

  get params() {
    return _.merge(this.authorizationParams, (this.options.params || {}))
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
      // return new Promise(() => {
      //   throw { 'associated records limited to one type of association': associationType }
      // })
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
            result[key] = convertRelationship(value)
            return result;
          }, {})
        .value()
    }

    function convertRelationship(value) {
      if (value.data === undefined) {
        return undefined
      }
      else if (_.isEmpty(value.data)) {
        return [ { id: "0" } ]
      }
      return _
        .chain([ value.data ])
        .flatten()
        .filter(v => v)
        .sort()
        .map(v => {
          return responseBody.included.find(o => {
            return v.id === o.id && v.type === o.type
          })
        })
        .map(relationshipRecord => {
          return convertRecord(relationshipRecord)
        })
        .value()
    }

    function isFalsey(value) {
      if (!value) {
        return true
      }
      if (typeof value === 'object') {
        return _.isEmpty(value)
      }
      return !value
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
