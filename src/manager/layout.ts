import ScreenLayout from './screen-layout';
import {Base} from './base';

export default class LayoutManager  extends Base {

  static parse(name:string, config:Named<ScreenLayoutExternal>):ScreenLayout[] {  
    return Object.values(Object.map(config, (conf, name) => {
      let out =  new ScreenLayout(conf);
      out.name = name;
      return out;
    }));
  }

  items:Named<ScreenLayout[]>
  active:ScreenLayout[];

  constructor(layouts:Named<Named<ScreenLayoutExternal>>) {
    super()
    this.items = Object.map(layouts, (l,name) => LayoutManager.parse(name, l));
  }
       
  detect(activeScreenNames:string[]):string {
     for (var l in this.items) {
      let screenNames = this.items[l].map(s => s.name);
      if (screenNames.matches(activeScreenNames)) {
        return l
      }
    }
  }
  
  activate(layout:string, activeScreens:Named<Screen>) {
    this.active = this.items[layout];
    this.active.forEach(l => {
      l.screen = activeScreens[l.name];
    });
    this.dispatchEvent("activated", layout);
  }
  
  select(activeScreens:Named<Screen>) {
    let layout = this.detect(Object.keys(activeScreens));
    if (layout) {
      this.activate(layout, activeScreens);
    } else {
      this.notify("Layout not found");
    }
  }
  
  layoutSingle(cls:Classification, windows:Window[]) {
    this.active.find(layout => layout.layout(cls, windows))
  }
  
  layout(mapping:Named<Named<ClassifiedAssign>>) {
    Object.forEach(mapping, (byTarget:Named<ClassifiedAssign>, target) => {
      Object.forEach(byTarget, (assign:ClassifiedAssign, id) => {
        this.layoutSingle(assign.cls, assign.windows);      
      })
    })
  }
}