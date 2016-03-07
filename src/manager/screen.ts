/// <reference path="../typings/layout.d.ts" />

export default class ScreenManager {
  activeScreens:Named<Screen>;  
  handlers:EventHandler[] = [];
    
  constructor(public screens:Named<Monitor>) {
    Object.forEach(screens, (p,name) => { p.name = name; })
    //this.handlers.push(Phoenix.on("screensDidChange", () => this.sync()));  
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
  }
}