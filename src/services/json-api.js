import _ from 'lodash'
import $http from '@/backend/vue-axios/axios';
import $store from '@/store';

import Company from '@/models/company'

export default class JsonApi {
  static findAll(resource, options) {
    return new JsonApi({
      resource: resource,
      options: options
    }).findAll
  }

  static findRecord(resource, id, options) {
    return new JsonApi({
      resource: resource,
      resourceId: id,
      options: options
    }).findRecord
  }

  constructor(args) {
    this.time         = Math.round(Date.now() / 1000);
    this.resource     = args.resource
    this.resourceId   = args.resourceId
    this.options      = args.options || {}
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

  get getHeaders() {
    return {
      'Accept': 'application/vnd.api+json',
    }
  }

  get url() {
    let url = `/${this.resource}`
    if (this.resourceId) {
      url = url + `/${this.resourceId}`
    }
    return url
  }

  get storeMethod() {
    let overrides = this.options.overrides || {};
    return overrides.storeMethod || 'insertOrUpdate'
  }

  get findAll() {
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

  get findRecord() {
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
        .omitBy(r => isFalsey(r))
        .value()
    }

    function convertRelationship(value) {
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
