/// <reference path="../typings/layout.d.ts" />
import {BaseItemed} from '../base';

export default class ScreenManager extends BaseItemed<Screen> {
  static buildKey(sc:Screen):string {
    let rc = sc.frameInRectangle();
    return `${rc.width}x${rc.height}`
  }
  
  byName:Named<Screen> = {};
  
  constructor(public screens:Named<Monitor>) {
    super()
    Object.forEach(screens, (p,name) => { p.name = name; })
    this.onPhoenixEvent("screensDidChange", () => this.sync());
  }
    
  sync() {
    this.notify("Attempting to sync displays");
    if (this.syncItems(Screen.screens())) {
      this.notify(`Screens changed`);
    }
  }  
  
  onItemAdded(s:Screen) {
    super.onItemAdded(s);
    let mon = this.findMonitor(s);
    if (mon != null) {
      this.byName[mon.name] = s; 
    }
  } 
  
  onItemRemoved(s:Screen) {
    super.onItemAdded(s);
    let mon = this.findMonitor(s);
    if (mon != null) {
      delete this.byName[mon.name]; 
    }
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
    let activeScreenKeys = Object.keys(this.byName);      
    
    let count = activeScreenKeys.length;
  
    if (count !== screens.length) {
      return false;
    }
    
    screens.forEach(name => {
      count -= (activeScreenKeys.indexOf(name) >= 0 ? 1 : 0);
    })
    
    return count === 0;
  }
}