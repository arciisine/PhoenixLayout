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
    this.keyHandlers.push(Phoenix.bind("a", ['cmd', 'shift'], () => this.layoutAll()))
    
    this.layoutAll();
  }
  
  windowAdded(w:Window) {
    this.layout(w);
  }
  
  screensChanged() {
    Phoenix.notify(`Screens changed`);
    this.layoutAll();
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
  
  layoutAll() {
    this.sync();
    Window.visibleWindows().forEach(w => this.layout(w));
  }
  
  layout(w:Window) {
    let cls = this.classes.classify(w);
    
    if (cls) {
      this.layouts.activeLayout.forEach(layout => {
        layout.layout(cls, [w]);
      })
    }
  }
}