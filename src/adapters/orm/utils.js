import _ from 'lodash'

export function mergeDeep(objOne, objTwo, options={}) {
  options.strings = options.strings || 'merge'
  options.arrays = options.arrays || 'merge'

  let keys = _.keys(objOne).concat(_.keys(objTwo))
  let newObj = {}

  keys.forEach((key) => {
    let _keyOne = objOne[key];
    let _keyTwo = objTwo[key]

    if (!_keyOne || !_keyTwo) {
      newObj[key] = _keyOne || _keyTwo;
    }
    else if (_.isString(_keyOne) && _.isString(_keyTwo)) {
      if (options.strings === 'merge') {
        newObj[key] = [ _keyOne ].concat([ _keyTwo ])
      }
      else {
        newObj[key] = _keyTwo
      }
    }
    else if (_.isArray(_keyOne) && _.isArray(_keyTwo)) {
      if (options.strings === 'merge') {
        newObj[key] = _keyOne.concat(_keyTwo)
      }
      else {
        newObj[key] = _keyTwo
      }
    }
    else if (_.isObject(_keyOne) && _.isObject(_keyTwo)) {
      newObj[key] = mergeDeep(_keyOne, _keyTwo, options)
    }
  })

  return newObj
}
