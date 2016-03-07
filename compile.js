let child_process = require('child_process');
let fs = require('fs');
let APP = './build/phoenix.js';
let OUT = process.env.HOME + '/.phoenix.js';

function register(window) {
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
  window.console.debug = noop; //window.console.log;
  window.console.error = window.console.log;
  if (window.require) {
    window.require_ = window.require;
  }
  window.require = imp
  window.define = register;
  window.module = { exports : {} };
}

function init(req) {
  req(['index'], function(app) { new app.default(); });;
}

//Compile
child_process.execSync(`./node_modules/.bin/tsc -p . --outFile ${APP}`);

//Read
let source = fs.readFileSync(APP);
//fs.unlinkSync(APP);

try { fs.mkdirSync('src/js'); } catch(e) {}

//Final
fs.writeFileSync(OUT, 
`register(this); 
${source}; 
init(this.require); 
${[init, register].map(x=>x.toString()).join(';\n')}`);