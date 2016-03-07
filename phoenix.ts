/// <reference path="./phoenix.d.ts" />

Object.values = function<T>(o:Named<T>):T[] {
  let out:T[] = [];
  for (let k in o) out.push(o[k]);
  return out;
}

Object.map = function<T,U>(o:Named<T>, fn:(T,string)=>U):Named<U> {
  let out:Named<U> = {};
  for (let k in o) out[k] = fn(o[k], k);
  return out;
}

Object.forEach = function<T>(o:Named<T>, fn:(T,string)=>void):void {
  for (let k in o) fn(o[k], k);
}

function message(msg) {
  let m = new Modal();
  m.message = msg
  m.duration = 5
  m.show()
}

function screenParse(name:string, config:Monitor) {
  config.name = name;
  return config;
}

function layoutParse(name:string, config:Named<ScreenLayoutConfig>):DesktopLayout {  
  let screens:Named<ScreenLayout> = Object.map(config, (conf, name) => {
    return new ScreenLayout(conf);
  });
  let out = new DesktopLayout(screens);
  out.name = name;
  return out;
}

function classesParse(name:string, config:ClassificationExternal[]):Classification[] {
  let toRegExp = (o) => o instanceof RegExp ? o : new RegExp('^'+o+'.*$')
 
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

class ScreenLayout {
  units:Size
  cells:{[cell:string]:Rectangle&{r:number,c:number}}

  constructor(cfg:ScreenLayoutConfig) {
    let items = cfg.format.trim().split('\n').map(x => x.trim().split(''));
    this.units = {width:items[0].length, height: items.length }
    this.cells = {};

    for (let r:number = 0; r < this.units.height; r++) {
      for (let c:number = 0; c < this.units.width; c++) {
        let it = items[r][c];
        let cell = this.cells[it] 
        if (!cell) {
          cell = this.cells[it] = {y:r, x:c, width: 1, height: 1, r,c};
        } else {
          cell.width  = Math.max(c - cell.c + 1, cell.width);
          cell.height = Math.max(r - cell.r + 1, cell.height);
        }
      }
    }
    for (var k in cfg.aliases) {
      let cell = this.cells[k];
      if (cell) {
        cfg.aliases[k].forEach(c => this.cells[c] = cell)
      }
    }
  }
  
  layout(screen:Screen, windows:Named<Window[]>) {
    let fr = screen.visibleFrameInRectangle();
    let dx = fr.width / this.units.width;
    let dy = fr.height / this.units.height;
    let ox = fr.x
    let oy = fr.y
        
    Object.keys(windows).forEach(cls => {
      let cell = this.cells[cls];
      if (!cell) return; // DO nothing if it doesn't match

      windows[cls].forEach(window => {        
        let dims = { 
          x      : ox + (cell.x * dx), 
          y      : oy + (cell.y * dy), 
          width  : cell.width * dx, 
          height : cell.height * dy  
        }
        Phoenix.notify(`Positioning: ${JSON.stringify(dims)}: ${window.app().name()} - ${window.title()}`)
        window.setFrame(dims);
      });
    });
  }
}

class DesktopLayout {
  name:string;
  
  constructor(public layouts:{[display:string]:ScreenLayout}) {}
}

class DesktopLayoutManager {
  activeScreens:Named<Screen>;
  activeLayout:DesktopLayout;
  activeWindows:Named<Window[]> = {};
  
  screens:Named<Monitor> = {};
  layouts:Named<DesktopLayout> = {};
  classes:Named<Classification[]> = {}

  private changeHandler:EventHandler;

  constructor(config:Configuration) {
    this.screens = Object.map(config.screens, (m,name) => screenParse(name, m));   
    this.layouts = Object.map(config.layouts, (l,name) => layoutParse(name, l));
    this.classes = Object.map(config.classes, (c,name) => classesParse(name, c));    
    this.changeHandler = Phoenix.on("screensDidChange", () => this.readState());
    this.readState();
  }
  
  layout() {
    for (var k in this.activeLayout.layouts) {
      this.activeLayout.layouts[k].layout(this.activeScreens[k], this.activeWindows);
    }
  }
  
  activateLayout(layout:DesktopLayout) {
    message(`Activating: ${layout.name}`)
    this.activeLayout = layout;
    
    let validAffinity = {};
    for (var k in this.activeLayout.layouts) {
      Object.keys(this.activeLayout.layouts[k].cells).forEach(a => validAffinity[a] = true)
    }
    
    this.layout();
  }
  
  readWindowState() {
    this.activeWindows = {};
    
    Window.visibleWindows().forEach(w => {
      let app = w.app().name();
      let window = w.title();
      
      for (let k in this.classes) {

        let found = this.classes[k].find(cls => {
          return !((cls.app && !cls.app.test(app)) 
            || (cls.window && !cls.window.test(window)) 
            || (cls.windowNot && cls.windowNot.test(window)));
        });
        
        if (found) {
          this.activeWindows[k] = this.activeWindows[k] || [];
          //Process each window only once
          this.activeWindows[k].push(w);
          break;
        }
      }
    });
    
  }
  
  readScreenState() {
    let screens:Monitor[] = Object.values(this.screens);
    
    this.activeScreens = {};
   
    Screen.screens().forEach(sc => {
      let rect = sc.frameInRectangle()
      let key = `${rect.width}x${rect.height}`;
      let res = screens.findIndex(x => x.size === key);
      if (res >= 0) {
        let monitor = screens.splice(res, 1)[0];
        this.activeScreens[monitor.name] = sc;
      }      
    });
  }
 
  determineActiveLayout() {
     this.activeLayout = null;
    
    let layouts = Object.values(this.layouts);
    
    for (let i = 0; i < layouts.length; i++) {
      let lo = layouts[i];
      let scKeys = Object.keys(this.activeScreens);
      let loKeys = Object.keys(lo.layouts);
      let count = scKeys.length;
            
      if (count !== loKeys.length) {
        continue;
      }
      
      loKeys.forEach(k => {
        if (scKeys.indexOf(k) >= 0) {
          count -= 1;
        }
      })
      
      if (count === 0) {
        return lo;
      }
    }
  }
    
  readState() {
    this.readWindowState();
    this.readScreenState();
    let layout = this.determineActiveLayout();
    if (layout) {
      this.activateLayout(layout);
    }      
  }  
}

////////////////////////////////////////////
let config:Configuration = {
  screens : {
    laptop : {size:'1680x1050'}, 
    vizio  : {size:'3200x1800'},
    tv     : {size:'1920x1080'} 
  },
  classes : {
    browser    : [ {app : 'Google Chrome', windowNot:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com|Hangouts).*$/}, 'Safari', 'Firefox'],
    terminal   : ['iTerm2'],
    notes      : ['Notes'],
    textEditor : [{app:/^Code.*$/}, 'Sublime Text'],
    ide        : ['Intellij'],
    chat       : ['HipChat', { app : 'Google Chrome', window : 'Hangouts' }],
    email      : [ {app : 'Google Chrome', window:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*$/}],
  },
  layouts : {
    home: {    
      vizio : {
        format :
        `aabbcc
         aabbcc
         aabbcc
         ddddcc`,
        aliases : {
          a : ['browser'],
          b : ['ide'],
          c : ['textEditor'],
          d : ['terminal']         
        }
      },
      laptop: {
        format  : `eef`,
        aliases : {
          e : ['email'],
          f : ['chat', 'notes']
        }
      }
    },
    alone: {
      laptop: { 
        format  : `aab`,
        aliases : {
          a : ['browser', 'textEditor', 'ide', 'email'],
          b : ['notes', 'terminal', 'chat']
        }
      }
    }
  }
}
  
let dlm = new DesktopLayoutManager(config);