import ScreenManager from './screen';
import WindowManager from './window';
import LayoutManager from './layout';
import ClassificationManager from './classification';
import {Base,Modifier} from './base';

export default class Manager extends Base {
  screens:ScreenManager
  windows:WindowManager
  layouts:LayoutManager
  classifications:ClassificationManager
  
  constructor(config:Configuration) {
    super()
    this.notify("Started");

    this.classifications = new ClassificationManager(config.classes);
    this.screens = new ScreenManager(config.screens);
    this.layouts = new LayoutManager(config.layouts);
    this.windows = new WindowManager(this.classifications);
    
    this.screens.on("changed", () => this.layouts.select(this.screens.byName));    
    this.windows.on("item-added", (w:Window) => this.layoutSingle(w));
    this.layouts.on("activated", name => {
      this.message(`Activating: ${name}`)
      this.refresh();
    });
    
    this.onPhoenixKey(".",    [Modifier.cmd, Modifier.shift], () => this.refresh())        
    this.onPhoenixKey("up",   [Modifier.cmd, Modifier.shift], () => this.windows.toggleFullScreen())
    this.onPhoenixKey("down", [Modifier.cmd, Modifier.shift], () => {
      let w = Window.focusedWindow()
      this.windows.reclassifyItem(w);
      this.layoutSingle(w)
    });
            
    this.screens.sync();
    this.windows.sync();
  }
  
  refresh() {    
    this.windows.reclassifyItems();
    this.layout();
  }
  
  layoutSingle(w:Window) {
    this.notify(`Single Layout: ${w.title()}`)
    this.layouts.layoutSingle(this.windows.windowClass[w.hash()], [w]);
  }
     
  layout() {
    this.layouts.layout(this.windows.grouped);
  }
}