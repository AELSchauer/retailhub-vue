function mergeValues(objValue, srcValue) {
  if (!_.isEmpty(objValue) && !_.isEmpty(srcValue)) {
    objValue = _.flatten([ objValue ])
    srcValue = _.flatten([ srcValue ])
    return objValue.concat(srcValue);
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
  getElementProperties(defaultOptions, userOptions) {
    return _
      .chain(defaultOptions)
      .keys()
      .concat(_.keys(userOptions))
      .sort()
      .sortedUniq()
      .reduce((result, propertyName) => {
        let defaultOption = _.get(defaultOptions, propertyName),
            defaultValue  = _.get(defaultOption, 'value'),
            defaultAction = _.get(defaultOption, 'action'),
            userValue     = _.get(userOptions, propertyName)

        if (defaultAction === 'delete') {
          // Do not add any value to the result object.
        }
        else if (defaultAction === 'overwrite') {
          _.set(result, propertyName, defaultValue)
        }
        else if (defaultAction === 'merge') {
          let mergedValue = mergeValues(defaultValue, userValue)
          mergedValue = (_.isArray(mergedValue)) ? (mergedValue.join(' ')) : (mergedValue)
          _.set(result, propertyName, mergedValue)
        }
        else {
          _.set(result, propertyName, userValue)
        }

        return result
      }, {})
      .value()
  },
  stringMerger(a, b) {
    return stringMerger(a, b)
  }

}
