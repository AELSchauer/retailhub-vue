// Dynamically load all the files in this filder except internal use
// files (_*.js) and the index. Then add the classes in those files 
// to an object that can be called by the loader class.

let context = require.context('./', true, /^.\/(?!index|_)[-a-z]+\.js$/);
let components = {};
context.keys().forEach(key => {
  let _module = context(key);
  let classNames = Object.keys(_module)
  classNames.forEach(className => {
    let _class = _module[className]
    components[_class.entity] = _class
    
  })
});

export default class ComponentLoader {
  constructor (className, opts) {
    return new components[className](opts);
  }
}
