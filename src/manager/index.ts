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
    this.screens = new ScreenManager(config.screens);
    this.classes = new ClassificationManager(config.classes);
    this.layouts = new LayoutManager(config.layouts);
    
    this.handlers.push(Phoenix.on('start', () => this.sync()));
    this.handlers.push(Phoenix.on('windowDidOpen', w => this.layout(w)));
    this.handlers.push(Phoenix.on('windowDidUnminimize', w => this.layout(w)));
    this.handlers.push(Phoenix.on("screensDidChange", () => this.screensChange()));
  }
  
  sync() {
    Phoenix.notify("Started");
    this.screensChange();
    Window.visibleWindows().forEach(w => this.layout(w));
  }
  
  screensChange() {
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
  
  layout(w:Window) {
    let cls = this.classes.classify(w);
    
    this.layouts.activeLayout.forEach(layout => {
      layout.layout(cls, [w]);
    })
  }
}