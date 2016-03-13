/// <reference path="../typings/layout.d.ts" />
import {BaseItemed} from '../base';

export default class ScreenManager extends BaseItemed<Screen> {
  static buildKey(sc:Screen):string {
    let rc = sc.frameInRectangle();
    return `${rc.width}x${rc.height}`
  }
  
  constructor(public screens:Named<Monitor>) {
    super()
    Object.forEach(screens, (p,name) => { p.name = name; })
    this.onPhoenixEvent("screensDidChange", () => this.sync());
  }
    
  findMonitor(sc:Screen):Monitor {
    let key = ScreenManager.buildKey(sc);
    for (let name in this.screens) {
      if (this.screens[name].size === key) {
        return this.screens[name];
      }
    }
    return null;
  }
  
  isMatching(screens:string[]):boolean {
    let activeScreenKeys = Object.keys(this.state)
      .map(id => this.findMonitor(this.state[id]).name);
      
    let count = activeScreenKeys.length;
  
    if (count !== screens.length) {
      return false;
    }
    
    screens.forEach(name => {
      count -= (activeScreenKeys.indexOf(name) >= 0 ? 1 : 0);
    })
    
    return count === 0;
  }
    
  sync() {
    this.notify("Attempting to sync displays");
    if (this.syncItems(Screen.screens())) {
      this.notify(`Screens changed`);
    }
  }
}