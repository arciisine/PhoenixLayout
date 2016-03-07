/// <reference path="../typings/layout.d.ts" />

export default class ClassificationManager {
  static parse(config:ClassificationExternal[]):Classification[] {
    let toRegExp = (o) => o instanceof RegExp ? o : new RegExp('^'+o+'.*$', 'i')
  
    return config.map(x => {
      if (typeof x === 'string') {
        return { app : toRegExp(x) };
      } else {
        let out:Classification = {};
        ['app','window','windowNot'].forEach(p => {
          if (x[p]) out[p] = toRegExp(x[p]);             
        })
        return out;
      }
    })
  }

  classes:Named<Classification[]>
  
  constructor(classes:Named<ClassificationExternal[]>) {
    this.classes = Object.map(classes, x => ClassificationManager.parse(x));
  }
  
  classify(w:Window):string {
    let app = w.app().name();
    let window = w.title();
      
    for (let k in this.classes) {
        
      let found = this.classes[k].find(cls => {
        return !((cls.app && !cls.app.test(app)) 
          || (cls.window && !cls.window.test(window)) 
          || (cls.windowNot && cls.windowNot.test(window)));
      });
      
      if (found) {      
        return k;
      }
    }
  }
}