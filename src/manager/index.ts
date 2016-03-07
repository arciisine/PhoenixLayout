import ScreenManager from './screen';
import ClassificationManager from './classification';
import LayoutManager from './layout';

type ClassifiedAssign = {cls:Classification, windows:Window[]};

export default class Manager {
  screens:ScreenManager
  classes:ClassificationManager
  layouts:LayoutManager
  
  private handlers:EventHandler[] = [];
  private keyHandlers:KeyHandler[] = [];

  constructor(config:Configuration) {
    Phoenix.notify("Started");

    this.screens = new ScreenManager(config.screens);
    this.classes = new ClassificationManager(config.classes);
    this.layouts = new LayoutManager(config.layouts);
    
    //this.handlers.push(Phoenix.on('windowDidOpen', w => this.windowAdded(w)));
    //this.handlers.push(Phoenix.on('windowDidUnminimize', w => this.windowAdded(w)));
    this.handlers.push(Phoenix.on("screensDidChange", () => this.screensChanged()));
    this.keyHandlers.push(Phoenix.bind("a", ['cmd', 'shift'], () => this.layout()))
    
    this.layout();
  }
  
  windowAdded(w:Window) {
    this.layout();
  }
  
  screensChanged() {
    Phoenix.notify(`Screens changed`);
    this.layout();
  }
  
  sync() {
    this.screens.sync();
    for (var l in this.layouts.layouts) {
      let screens = this.layouts.layouts[l];
      let screenNames = screens.map(s => s.name);
      if (this.screens.isMatching(screenNames)) {
        message(`Activating: ${l}`);
        this.layouts.activate(l, this.screens.activeScreens);
        return;
      }
    }
  }
  
  layout() {
    this.sync();
    let mapping:Named<Named<ClassifiedAssign>> = {}
    
    Window.visibleWindows().forEach(w => {
      let cls = this.classes.classify(w);
      let app = w.app().name();
      if (cls) {
        mapping[cls.target] = mapping[cls.target] || {};
        mapping[cls.target][cls.id] = mapping[cls.target][cls.id] || { cls : cls, windows : [] };
        mapping[cls.target][cls.id].windows.push(w);
      }
    });
    
    Object.forEach(mapping, (byTarget:Named<ClassifiedAssign>, target) => {
      Object.forEach(byTarget, (assign:ClassifiedAssign, id) => {
        this.layouts.activeLayout.forEach(layout => {
          layout.layout(assign.cls.target, assign.cls, assign.windows);
        });
      })
    })
  }
}