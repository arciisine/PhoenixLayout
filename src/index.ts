import Manager from './manager/index';
import config from './config';

let cfg = config;
try {
  cfg = require_('./.phoenix.config.js') || config;
} catch (e) {
  //Do nothing
}

let mgr = null;

export default function() {
  mgr = new Manager(cfg);
}

