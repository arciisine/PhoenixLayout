import Manager from './manager/index';
import config from './config';

export default function() {
  let mgr = new Manager(config);
  Phoenix.notify("Starting");
  mgr.sync();
}

