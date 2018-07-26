export default class TokenConverter {
  static convertJsonToInlineTokens(item, attrName) {
    try {
      return new TokenConverter(item, attrName).convertJsonToInlineTokens()
    }
    catch (error) {
      console.error('error', error)
      return {}
    }
  }

  static convertJsonToText(item, attrName) {
    try {
      return new TokenConverter(item, attrName).convertJsonToText()
    }
    catch (error) {
      console.error('error', error)
      return {}
    }
  }

  constructor(item, attrName) {
    this.item       = item
    this.attrName   = attrName
    // this.delimiter  = item.manifest[attrName].manifest.delimiter
    // this.value      = item[attrName]
  }

  convertJsonToInlineTokens() {
    return this.item
  } 

  convertJsonToText() {
    return this.item
  } 
}
