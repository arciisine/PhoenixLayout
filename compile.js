let child_process = require('child_process');
let fs = require('fs');
let APP = './build/phoenix.js';
let OUT = process.env.HOME + '/.phoenix.js';

function register(window) {
  var loaded = { _req : function() {} };
  var registry = { _req : [] };
  
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
  window.console.debug = noop; //window.console.log;
  window.console.error = window.console.log;
  window._req = imp
  window.define = register;
  window.module = { exports : {} };
}

function init(_req) {
  require('./.phoenix.config.js')
  _req(['index'], function(app) { new app.default(); });
}

//Compile
child_process.execSync(`./node_modules/.bin/tsc -p . --outFile ${APP}`);

//Read
var source = fs.readFileSync(APP).toString()

source = source
  .replace(/require/g, '_req')

//Final
fs.writeFileSync(OUT, 
`register(this); 
${source}; 
init(this._req); 
${[init, register].map(x=>x.toString()).join(';\n')}`);