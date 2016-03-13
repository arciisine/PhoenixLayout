import ScreenLayout from '../layout/screen';
import {Base} from '../base';

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
       
  detectLayout(activeScreenNames:string[]):string {
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
    let layout = this.detectLayout(Object.keys(activeScreens));
    this.activate(layout, activeScreens);
  }
  
  layout(mapping:Named<Named<ClassifiedAssign>>) {     
    Object.forEach(mapping, (byTarget:Named<ClassifiedAssign>, target) => {
      Object.forEach(byTarget, (assign:ClassifiedAssign, id) => {
        this.active.forEach(layout => {
          layout.layout(assign.cls, assign.windows);
        });
      })
    })
  }
}