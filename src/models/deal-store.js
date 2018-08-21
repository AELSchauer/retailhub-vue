import Model from '@/services/customized-model'

export default class DealStore extends Model {
  static entity = 'deal-stores'
  static primaryKey = ['deal_id', 'store_id']

  static fields () {
    return {
      deal_id: this.attr(null),
      store_id: this.attr(null)
    }
  }
}
