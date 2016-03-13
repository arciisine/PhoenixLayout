import ScreenManager from './screen';
import ClassificationManager from './classification';
import LayoutManager from './layout';
import Base from '../base';

export default class Manager extends Base {
  screens:ScreenManager
  classes:ClassificationManager
  layouts:LayoutManager
  
  private previousSizes:{[key:number]:Rectangle} = {}

  constructor(config:Configuration) {
    super()
    this.notify("Started");

    this.screens = new ScreenManager(config.screens);
    this.classes = new ClassificationManager(config.classes);
    this.layouts = new LayoutManager(config.layouts);
    
    //this.handlers.push(Phoenix.on('windowDidOpen', w => this.windowAdded(w)));
    //this.handlers.push(Phoenix.on('windowDidUnminimize', w => this.windowAdded(w)));
    this.screens.on("change", () => this.layout());
    
    this.onPhoenixKey(".", ['cmd', 'shift'], () => {
      this.notify("Relayout called on keypress")
      this.layout()
    })
    this.onPhoenixKey("up", ['cmd', 'shift'], () => this.toggleFullScreen())
    this.layout();
  }
  
  toggleFullScreen(w:Window = null) {
    if (w === null) {
      w = Window.focusedWindow();
    }
    let size = w.screen().visibleFrameInRectangle();
    if (this.previousSizes[w.hash()]) {
      size = this.previousSizes[w.hash()];
      delete this.previousSizes[w.hash()];
    } else {
      this.previousSizes[w.hash()] = w.frame()
    }
    w.setSize(size);
  }
  
  windowAdded(w:Window) {
    this.layout();
  }
  
  screensChanged() {        
    this.layout();
  }
  
  sync() {
    this.screens.sync();
    for (var l in this.layouts.layouts) {
      let screens = this.layouts.layouts[l];
      let screenNames = screens.map(s => s.name);
      if (this.screens.isMatching(screenNames)) {
        this.message(`Activating: ${l}`);
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