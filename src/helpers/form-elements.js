function customizer(objValue, srcValue) {
  if (objValue && srcValue) {
    return [objValue].concat([srcValue]);
  }
  else {
    return objValue || srcValue
  }
}

function stringMerger(stringA, stringB) {
  return _
    .chain([ stringA ])
    .concat([ stringB ])
    .compact()
    .join(' ')
    .value()
}

export default {
  getInputProperties(defaultOptions, overrideOptions) {
    return _
      .chain(defaultOptions)
      .reduce((result, v, k) => {
        return _.set(result, k, v.value)
      }, {})
      .mergeWith(overrideOptions, customizer)
      .reduce((result, v, k) => {
        if(_.isArray(v)) {
          let defaultOption = defaultOptions[k]

          if (!defaultOption) {
            console.error('ERROR: Do no pass arrays into the defaultOptions or the component options')
          }

          if (defaultOption.action === 'overwrite') {
            _.set(result, k, v[1])
          }
          else if (defaultOption.action === 'merge') {
            if (_.isString(v[0]) && _.isString(v[1])) {
              _.set(result, 'class', stringMerger(v[0], v[1]))
            }
            else {
              console.error('ERROR: Developer must add support for merge of non-strings')
            }
          }
          else {
            console.error('ERROR: Please specify what you want to do with this action:', defaultOption.action)
          }
        }
        else {
          _.set(result, k, v)
        }
        return result
      }, {})
      .value()
  },
  stringMerger(a, b) {
    return stringMerger(a, b)
  }

}
