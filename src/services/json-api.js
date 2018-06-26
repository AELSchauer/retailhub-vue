import _ from 'lodash'
import $store from './../store';

export default class JsonApi {
  static findAll(resource) {
    return new JsonApi({ resource: resource }).findAll
  }

  static convertJsonApiToVueOrm(body) {
    function convert(jsonRecord) {
      return _.merge({ id: jsonRecord.id }, jsonRecord.attributes)

      // TODO -- add functionality that parses out included relationships
    }

    if(body.data.constructor.name === 'Array') {
      return body.data.map(record => {
        return convert(record)
      })
    }
    else if (body.data.constructor.name === 'Object') {
      return convert(body.data)
    }
    else {
      console.error('well shit')
      return body.data
    }
  }

  constructor(args) {
    this.resource     = args.resource
    this.resource_id  = args.resource_id
    this.time         = Math.round(Date.now() / 1000);
  }

  get currentUser() {
    return $store.getters.currentUser
  }

  get authorizationToken() {
    return this.currentUser.authenticationToken(this.time)
  }

  get getHeaders() {
    return {
      'Accept': 'application/vnd.api+json',
    }
  }

  get url() {
    let url = `/${this.resource}`
    if (this.resource_id) {
      url = url + `/${this.resource_id}`
    }
    return url
  }

  get authorizationParams() {
    return {
      auth_id:        this.currentUser.id,
      auth_timestamp: this.time,
      auth_token:     this.authorizationToken,
    }
  }

  get findAll() {
    let query = {
      method: 'get',
      url: this.url,
      headers: this.getHeaders,
      params: this.authorizationParams
    }
    console.log('findAll', query)
    return query
  }
}
