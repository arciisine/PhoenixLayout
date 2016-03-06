/// <reference path="./phoenix.d.ts" />
/// <reference path="./node_modules/typescript/lib/lib.core.es6.d.ts" />
type Cell = string;

type LayoutConfig = {format:string, aliases:{[key:string]:string[]}}

type Classification = {app?:RegExp, window?:RegExp, windowNot?:RegExp}

function message(msg) {
  let m = new Modal();
  m.message = msg
  m.duration = 5
  m.show()
}

function toRegExp(o) {
  return o instanceof RegExp ? o : new RegExp('.*'+o+'.*')
}

function layoutParser(layouts:[string, {[name:string]:LayoutConfig}][]) {
  return layouts.map(p => {
    let screens:{[key:string]:ScreenLayout} = {};
    for (var k in p[1]) {
      screens[k] = new ScreenLayout(p[1][k]);
    }      
    return new DesktopLayout(p[0], screens);
  })
}

function classesParser(classes:{[key:string]:({app?:string|RegExp, window?:string|RegExp, windowNot?:string|RegExp}|string)[]}) {
  let out:{[key:string]:Classification[]} = {};
  for (var k in classes) {
    out[k] = classes[k].map(x => {
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
  return out;
}

class ScreenLayout {
  units:Size
  cells:{[cell:string]:Rectangle&{r:number,c:number}}

  constructor(cfg:LayoutConfig) {
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
  
  layout(screen:Screen, windows:{[key:string]:Window[]}) {
    let dx = screen.visibleFrameInRectangle().width / this.units.width;
    let dy = screen.visibleFrameInRectangle().height / this.units.height;
    Object.keys(windows).forEach(cls => {
      let cell = this.cells[cls];
      if (!cell) return; // DO nothing if it doesn't match

      windows[cls].forEach(window => {        
        let dims = { 
          x      : cell.x * dx, 
          y      : cell.y * dy, 
          width  : cell.width * dx, 
          height : cell.height * dy  
        }
        window.setFrame(dims);
      });
    });
  }
}

class DesktopLayout {
  constructor(public name:string, public layouts:{[display:string]:ScreenLayout}) {}
}

class DesktopLayoutManager {
  static SCREENS = {
    '1680x1050' : ['laptop'], 
    '3050x2000' : ['vizio'],
    '1920x1080' : ['tv'] 
  }
  
  activeScreens:{[name:string]:Screen};
  activeLayout:DesktopLayout;
  activeWindows:{[cls:string]:Window[]} = {};

  constructor(public layouts:DesktopLayout[], public classes:{[key:string]:Classification[]}) {}
  
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
    let screens:{[key:string]:string[]} = {};
    for (var k in DesktopLayoutManager.SCREENS) {
      screens[k] = DesktopLayoutManager.SCREENS[k].slice(0);
    }
    
    this.activeScreens = {};

    
    Screen.screens().forEach(sc => {
      let rect = sc.frameInRectangle()
      let key = `${rect.width}x${rect.height}`;
      this.activeScreens[screens[key].shift()] = sc;
    });
  }
 
  determineActiveLayout() {
     this.activeLayout = null;
    
    for (let i = 0; i < this.layouts.length; i++) {
      let lo = this.layouts[i];
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
let applicationClasses:{[key:string]:({app?:string|RegExp, window?:string|RegExp, windowNot?:string|RegExp}|string)[]} = {
  browser    : [ {app : 'Google Chrome', windowNot:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com|Hangouts).*$/}, 'Safari', 'Firefox'],
  terminal   : ['iTerm2'],
  notes      : ['Notes'],
  textEditor : [{app:/^Code.*$/}, 'Sublime Text'],
  ide        : [{app:/^Intellij.*$/}],
  chat       : ['HipChat', { app : 'Google Chrome', window : 'Hangouts' }],
  email      : [ {app : 'Google Chrome', window:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*$/}],
}

let layouts:[string, {[name:string]:LayoutConfig}][] = [
  ['home', {    
    vizio : {
      format :
      `aabbcc
       aabbcc
       aabbcc
       ddddcc`,
       aliases : {}
    },
    laptop: {
      format  : `eef`,
      aliases : {}
    }
  }],
  ['alone', {
    laptop: { 
      format  : `aab`,
      aliases : {
        a : ['browser', 'textEditor', 'ide', 'email'],
        b : ['notes', 'terminal', 'chat']
      }
    }
  }]
]

let dlm = new DesktopLayoutManager(layoutParser(layouts), classesParser(applicationClasses));

dlm.readState()