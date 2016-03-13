import ScreenManager from './screen';
import WindowManager from './window';
import LayoutManager from './layout';
import Classifier from './classifier';
import {Base,Modifier} from '../base';

export default class Manager extends Base {
  screens:ScreenManager
  windows:WindowManager
  layouts:LayoutManager
  
  constructor(config:Configuration) {
    super()
    this.notify("Started");

    this.screens = new ScreenManager(config.screens);
    this.windows = new WindowManager(new Classifier(config.classes));
    this.layouts = new LayoutManager(config.layouts);
    
    this.screens.on("changed", () => this.layouts.select(this.screens.byName));    
    this.windows.on("changed", () => this.layout());
    this.layouts.on("activated", name => {
      this.message(`Activating: ${name}`)
      this.layout();
    });
    
    this.onPhoenixKey(".",  [Modifier.cmd, Modifier.shift], () => this.layout())        
    this.onPhoenixKey("up", [Modifier.cmd, Modifier.shift], () => this.windows.toggleFullScreen())
            
    this.screens.sync();
    this.windows.sync();
  }
     
  layout() {
    this.layouts.layout(this.windows.groupedByClassification());
  }
}