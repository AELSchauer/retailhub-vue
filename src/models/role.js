export default class Role {
  constructor (json) {
    this.id           = json.id
    this.name         = json.attributes.name
    this.resourceType = json.attributes.resource_type
    this.resourceId   = json.attributes.resource_id
  }

  get isAdmin() {
    return this.name === 'admin'
  }
}
