exports.register = function register(window) {
  var loaded = { require : function() {} };
  var registry = { require : [] };
  
  function register(name, deps, cb) {
    registry[name] = [deps, cb];
  }
  
  function resolve(name) {
    if (!registry[name]) {
      console.debug("Module is not defined: "+ name);
      throw new Error("Module is not defined: "+ name);
    }       
    if (!loaded[name]) {
      var set = registry[name];
      loaded[name] = {  };
      console.debug("Resolving: "+name +" "+JSON.stringify(set[0]));
      set[1].apply(this, set[0].map(function(x) {
        return x == 'exports' ? loaded[name] : resolve(x);
      }));
    }
    return loaded[name];
  }
  
  function imp(names, cb) {
    console.debug("Importing: "+JSON.stringify(names));
    cb.apply(this, names.map(function(x) {
      return resolve(x);
    }));
  }
  
  var noop = function() {}
  if (window.require) {
    window.require_ = window.require;
  }
  window.console.debug = noop; //window.console.log;
  window.console.error = window.console.log;
  window.require = imp
  window.define = register;
  window.module = { exports : {} };
}

exports.init = function init(require) {
  this.phoenixConfig = null;
  require(['index'], function(app) { new app.default(); });
}