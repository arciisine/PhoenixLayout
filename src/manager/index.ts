import ScreenManager from './screen';
import WindowManager from './window';
import LayoutManager from './layout';
import {Base,Modifier} from '../base';

export default class Manager extends Base {
  screens:ScreenManager
  windows:WindowManager
  layouts:LayoutManager
  
  private previousSizes:Numbered<Rectangle> = {}

  constructor(config:Configuration) {
    super()
    this.notify("Started");

    this.screens = new ScreenManager(config.screens);
    this.windows = new WindowManager(config.classes);
    this.layouts = new LayoutManager(config.layouts);
    
    this.screens.on("change", () => {
      this.selectLayout();
      this.layout()
    });
    this.windows.on("change", () => this.layout);
    
    this.onPhoenixKey(".",  [Modifier.cmd, Modifier.shift], () => this.layout());        
    this.onPhoenixKey("up", [Modifier.cmd, Modifier.shift], () => this.toggleFullScreen())
            
    this.screens.sync();
    this.windows.sync();
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
        this.layouts.activate(l, this.screens.byName);
        return;
      }
    }
  }
  
  layout() {   
    this.layouts.layout(this.windows.classifyAndGroup());
  }
}