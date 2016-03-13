/// <reference path="../typings/layout.d.ts" />
import {BaseItemed} from './base';

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
    this.on('changed', () => this.notify(`Screens changed`))
  }
    
  sync() {
    this.notify("Attempting to sync displays");
    this.notify(`All: ${Screen.screens().map(x => x.hash()).join(' ')}`)
    this.syncItems(Screen.screens())
  }  
  
  onItemAdded(s:Screen) {
    Phoenix.notify(`Added ${s.hash()}`);
    super.onItemAdded(s);
    let mon = this.findMonitor(s);
    if (mon != null) {
      this.byName[mon.name] = s; 
    }
  } 
  
  onItemRemoved(s:Screen) {
    Phoenix.notify(`Removed ${s.hash()}`);
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
}