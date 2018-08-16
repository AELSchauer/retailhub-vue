import _ from 'lodash'
import { mergeDeep } from './utils'
import $http from '@/config/axios';
import $store from '@/store';

export default class JsonApi {
  constructor({ ...args }) {
    this.resource          = args.resource
    this.id                = args.id
    this.options           = args.options || {};
    this.associatedRecords = args.associatedRecords
    this.changes           = args.changes
    this.options           = args.options || {}
  }

  find() {
    return $http.request({
      method: 'GET',
      url: this._url(),
      headers: this._headers('GET'),
      params: this._requestParams()
    })
  }

  all() {
    return $http.request({
      method: 'GET',
      url: this._url(),
      headers: this._headers('GET'),
      params: this._requestParams()
    })
  }

  create() {
    return $http.request({
      method: 'POST',
      url: this._url(),
      headers: this._headers('POST'),
      params: this._requestParams(),
      data: {
        data: {
          type: this.resource,
          attributes: this.changes.attributes,
          relationships: this.changes.relationships
        }
      }
    })
  }

  _url() {
    try {
      let url = `/${this.resource}`

      if (this.id) {
        url = url + `/${this.id}`
      }

      if (!this._associationType()) {
        url = url + `/relationships/${this.associationType}`
      }

      return url
    }
    catch(e) {
      return e
    }
  }

  _headers(method) {
    if (_.includes(['GET'], method)) {
      return {
        'Accept': 'application/vnd.api+json'
      }
    }
    else if (_.includes(['POST', 'PATCH', 'DELETE'], method)) {
      return {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    }
  }

  get _currentUser() {
    return $store.getters.currentUser
  }

  get _time() {
    return Math.round(Date.now() / 1000);
  }

  get _authorizationToken() {
    return this._currentUser.authenticationToken(this._time)
  }

  _authorizationParams() {
    return {
      auth_id:        this._currentUser.id,
      auth_timestamp: this._time,
      auth_token:     this._authorizationToken,
    }
  }

  _buildParams() {
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

    let params = this.options.params
    let include = formatInclude(_.get(params, 'include'))
    if (!_.isEmpty(include)) {
      params.include = include
    }

    return params
  }

  _requestParams() {
    return _.merge(this._authorizationParams(), this._buildParams())
  }

  _associationType() {
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

}
