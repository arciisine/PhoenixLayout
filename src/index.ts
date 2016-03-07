import Manager from './manager/index';
import config from './config';

let cfg = config;
try {
  cfg = require_('./.phoenix.config.js') || config;
} catch (e) {
  //Do nothing
}

export default function() {
  let mgr = new Manager(cfg);
  Phoenix.notify("Starting");
  mgr.layoutAll();
}

