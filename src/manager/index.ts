import ScreenManager from './screen';
import ClassificationManager from './classification';
import LayoutManager from './layout';
import {Base,Modifier} from '../base';

export default class Manager extends Base {
  screens:ScreenManager
  classes:ClassificationManager
  layouts:LayoutManager
  
  private previousSizes:Numbered<Rectangle> = {}

  constructor(config:Configuration) {
    super()
    this.notify("Started");

    this.screens = new ScreenManager(config.screens);
    this.classes = new ClassificationManager(config.classes);
    this.layouts = new LayoutManager(config.layouts);
    
    this.onPhoenixEvent("windowDidOpen windowDidUnminimize", (w:Window) => {
      if (w.isNormal() && w.isVisible()) this.layout();
    });
    
    this.screens.on("change", () => {
      this.selectLayout();
      this.layout()
    });
    
    this.onPhoenixKey(".",  [Modifier.cmd, Modifier.shift], () => this.layout());        
    this.onPhoenixKey("up", [Modifier.cmd, Modifier.shift], () => this.toggleFullScreen())
       
    this.screens.sync();
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
    w.setTopLeft(size);
    w.setSize(size);
  }
  
  selectLayout() {
    for (var l in this.layouts.layouts) {
      let screens = this.layouts.layouts[l];
      let screenNames = screens.map(s => s.name);
      if (this.screens.isMatching(screenNames)) {
        this.message(`Activating: ${l}`);
        this.layouts.activate(l, this.screens.items);
        return;
      }
    }
  }
  
  layout() {   
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