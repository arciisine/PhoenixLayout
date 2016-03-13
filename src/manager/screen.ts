/// <reference path="../typings/layout.d.ts" />
import Base from '../base';

export default class ScreenManager extends Base {
  activeScreens:Named<Screen>;  
  activeScreenIds:{[key:number]:Screen} = {}
    
  constructor(public screens:Named<Monitor>) {
    super()
    Object.forEach(screens, (p,name) => { p.name = name; })
    this.onPhoenixEvent("screensDidChange", () => this.sync());  
  }
  
  isMatching(screens:string[]):boolean {
    let activeScreenKeys = Object.keys(this.activeScreens);
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
    let ids = this.activeScreenIds;
    this.activeScreenIds = {};
    let changed = false;
    
    Screen.screens().forEach(sc => {
      let key = sc.hash();
      changed = changed || !ids[key]; //Added
      this.activeScreenIds[key] = sc;
      delete ids[key]
    })
    
    changed = changed || Object.keys(ids).length > 0;
    
    if (!changed) {
      return;
    } 
    
    let screens:Monitor[] = Object.values(this.screens);
    
    this.activeScreens = {};  
   
    Screen.screens().forEach(sc => {
      let rect = sc.frameInRectangle()
      let key = `${rect.width}x${rect.height}`;
      let mon = screens.find(m => m.size == key);
      if (mon) {
        this.activeScreens[mon.name] = sc;
      }
    });
    
    this.notify(`Screens changed`);
    this.dispatchEvent("changed", this.activeScreens);
  }
}