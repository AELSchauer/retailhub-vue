import Model from '@/services/custom-vuex-orm-model'

export default class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id:   this.attr(null),
      type: this.attr('images'),

      url:      this.attr(''),
      alt_text: this.attr(''),

      imageable_id:   this.attr(null),
      imageable_type: this.attr(null),
    }
  }
}
