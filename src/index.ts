import Manager from './manager/index';
import DefaultConfig from './config';

let mgr = null;

export default function() {
  require_('./.phoenix.config.js');
  mgr = new Manager(phoenixConfig || DefaultConfig);
}

