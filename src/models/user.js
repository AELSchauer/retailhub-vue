import Role from './role'
import md5 from 'md5-hex'

export default class User {
  static from(jsonString) {
    try {
      return new User(JSON.parse(jsonString))
    } catch (_) {
      return null
    }
  }

  constructor(json) {
    this.id            = json.id
    this.email         = json.attributes.email
    this.token         = json.attributes.authentication_token
    this.relationships = (json.included || json.related)
  }

  get roles() {
    let roles  = this.relationships.filter(incl => incl.type === 'roles')
    return roles.map(roleJson => new Role(roleJson))
  }

  get isAdmin() {
    return this.roles.filter(role => role.isAdmin).length > 0
  }

  authenticationToken(time) {
    return md5(`${time}:${this.token}`)
  }
}
