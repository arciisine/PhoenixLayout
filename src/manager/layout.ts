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

  layouts:Named<ScreenLayout[]>
  activeLayout:ScreenLayout[];

  constructor(layouts:Named<Named<ScreenLayoutExternal>>) {
    super()
    this.layouts = Object.map(layouts, (l,name) => LayoutManager.parse(name, l));
  }
  
  isMatching(toCheck:string[], screens:Named<Screen>):boolean {
    let activeScreenKeys = Object.keys(screens);      
    
    let count = activeScreenKeys.length;
  
    if (count !== toCheck.length) {
      return false;
    }
    
    toCheck.forEach(name => {
      count -= (activeScreenKeys.indexOf(name) >= 0 ? 1 : 0);
    })
    
    return count === 0;
  }
  
  select(screens:Named<Screen>) {
     for (var l in this.layouts) {
      let screenNames = this.layouts[l].map(s => s.name);
      if (this.isMatching(screenNames, screens)) {
        this.activate(l, screens);
        return;
      }
    }
  }
  
  activate(name:string, screens:Named<Screen>) {
    this.activeLayout = this.layouts[name];
    this.activeLayout.forEach(l => {
      l.screen = screens[l.name];
    });
    this.dispatchEvent("activated", name);
  }
  
  layout(mapping:Named<Named<ClassifiedAssign>>) {     
    Object.forEach(mapping, (byTarget:Named<ClassifiedAssign>, target) => {
      Object.forEach(byTarget, (assign:ClassifiedAssign, id) => {
        this.activeLayout.forEach(layout => {
          layout.layout(assign.cls, assign.windows);
        });
      })
    })
  }
}