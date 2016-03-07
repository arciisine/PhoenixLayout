import ScreenManager from './screen';
import ClassificationManager from './classification';
import LayoutManager from './layout';

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

   let mapping = this.classes.classifyAndGroup(Window.visibleWindows());
    
    Object.forEach(mapping, (byTarget:Named<ClassifiedAssign>, target) => {
      Object.forEach(byTarget, (assign:ClassifiedAssign, id) => {
        this.layouts.activeLayout.forEach(layout => {
          layout.layout(assign.cls, assign.windows);
        });
      })
    })
  }
}