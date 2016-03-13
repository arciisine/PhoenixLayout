/// <reference path="../typings/layout.d.ts" />
import {BaseItemed} from '../base';
import Classifier from './classifier';

export default class WindowManager extends BaseItemed<Window> {

  windowClass:Numbered<Classification> = {}
  previousSizes:Numbered<Rectangle> = {}

  constructor(public classifier:Classifier) {
    super()
    this.onPhoenixEvent("windowDidOpen windowDidUnminimize", (w:Window) => this.sync());
  }
  
  sync() {
    this.syncItems(Window.visibleWindows().filter( w => w.isNormal() )) 
  }
  
  onItemAdded(w:Window) {
    super.onItemAdded(w);
    this.windowClass[w.hash()] = this.classifier.classify(w);
  }
  
  onItemRemoved(w:Window) {
    super.onItemRemoved(w);
    delete this.windowClass[w.hash()];    
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
    
  groupedByClassification():Named<Named<ClassifiedAssign>> {
    let mapping:Named<Named<ClassifiedAssign>> = {}
    Object.forEach(this.windowClass, (cls:Classification, id:number) => {
      mapping[cls.target] = mapping[cls.target] || {};
      mapping[cls.target][cls.id] = mapping[cls.target][cls.id] || { cls : cls, windows : [] };
      mapping[cls.target][cls.id].windows.push(this.items[id]);
    });    
    return mapping;
  }
}