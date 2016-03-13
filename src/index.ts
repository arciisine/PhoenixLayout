import Manager from './manager/index';
import DefaultConfig from './config';

let mgr = null;

export default function() {
  mgr = new Manager(phoenixConfig || DefaultConfig);
}

