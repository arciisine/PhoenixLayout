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
    
    this.handlers.push(Phoenix.on('start', () => this.layoutAll()));
    //this.handlers.push(Phoenix.on('windowDidOpen', w => { Phoenix.notify(`Opened: ${w.app().name()} - ${w.title()}`); this.layout(w)}));
    //this.handlers.push(Phoenix.on('windowDidUnminimize', w => { Phoenix.notify(`Unminimize:  ${w.app().name()} - ${w.title()}`);this.layout(w)}));
    this.handlers.push(Phoenix.on("screensDidChange", () => this.layoutAll()));
    this.keyHandlers.push(Phoenix.bind("a", ['cmd', 'shift'], () => this.layoutAll()))
  }
  
  sync() {
    Phoenix.notify("Started");
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
    
    this.layouts.activeLayout.forEach(layout => {
      layout.layout(cls, [w]);
    })
  }
}