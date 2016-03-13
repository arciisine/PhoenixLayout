let child_process = require('child_process');
let fs = require('fs');
let APP = './build/phoenix.js';
let fns = require('./bootstrap');

//Compile
child_process.execSync(`./node_modules/.bin/tsc -p . --outFile ${APP}`);

//Read
var source = fs.readFileSync(APP)

//Final
fs.writeFileSync(process.env.HOME + '/.phoenix.js', 
`register(this); 
${source}; 
init(this.require); 
${[fns.init, fns.register].map(x=>x.toString()).join(';\n')}`);