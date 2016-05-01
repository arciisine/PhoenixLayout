/// <reference path="../typings/layout.d.ts" />
import {BaseItemed} from './base';
import ClassificationManager from './classification';

export default class WindowManager extends BaseItemed<Window> {

  windowClass:Numbered<Classification> = {}
  grouped:Named<Named<ClassifiedAssign>> = {}
  
  constructor(public classifications:ClassificationManager) {
    super()
    this.onPhoenixEvent("windowDidOpen windowDidUnminimize", (w:Window) => this.sync());
    this.onPhoenixEvent("appDidLaunch appDidActivate appDidShow", (a:App) => this.sync());
  }
  
  sync() {
    this.syncItems(Window.visibleWindows().filter( w => w.isNormal() )) 
  }
  
  groupItem(w:Window) {
    let cls = this.windowClass[w.hash()] = this.classifications.classify(w);
    if (cls) {
      let l1 = this.grouped[cls.target] = this.grouped[cls.target] || {};
      let l2 = l1[cls.id] = l1[cls.id] || { cls : cls, windows : [] };
      l2.windows.push(w);
    }
  }
  
  ungroupItem(w:Window) {
    let key = w.hash();
    let cls = this.windowClass[key];
    
    if (cls && this.grouped[cls.target] && this.grouped[cls.target][cls.id]) {
      this.grouped[cls.target][cls.id].windows = 
        this.grouped[cls.target][cls.id].windows.filter(w2 => w2.hash() !== key)
    } 
    
    delete this.windowClass[key];
  }
  
  reclassifyItem(w:Window) {
    this.ungroupItem(w);
    this.groupItem(w);
  }
  
  reclassifyItems() {
    Object.forEach(this.items, (w:Window, k:number) => {
      if (this.windowClass[k] !== this.classifications.classify(w)) {
        this.ungroupItem(w);
        this.groupItem(w);
      }
    });
  }
  
  onItemAdded(w:Window) {
    super.onItemAdded(w);
    this.groupItem(w);
  }
  
  onItemRemoved(w:Window) {
    super.onItemRemoved(w);
    this.ungroupItem(w);
  }
  
  toggleFullScreen(w:Window = null) {
    if (w === null) {
      w = Window.focusedWindow();
    }
    w.setFullScreen(!w.isFullScreen()) 
  }
}