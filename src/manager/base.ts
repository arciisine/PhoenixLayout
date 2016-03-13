/// <reference path="../typings/layout.d.ts" />

export enum Modifier {
  cmd, alt, ctrl, shift
}

export abstract class Base {
  private listeners:Named<Listener[]> = {}
  private handlers:EventHandler[] = [];
  private keyHandlers:KeyHandler[] = [];

  notify(msg:string) {
    Phoenix.notify(msg);
  }
  
  message(msg) {
    let m = new Modal();
    m.message = msg
    m.duration = 5
    m.show()
  } 
  
  onPhoenixEvent(ev:string, fn:(e?:any)=>void) {
    ev.split(' ').forEach(e => 
      this.handlers.push(Phoenix.on(e, fn)));
  }
  
  onPhoenixKey(key:string, modifiers:Modifier[], fn:()=>void) {
    this.keyHandlers.push(Phoenix.bind(key, modifiers.map(x => Modifier[x]), fn));
  }  

  on(key:string, listener:Listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(listener);
  }
  
  dispatchEvent(key:string, e:any = null) {
    (this.listeners[key] || []).forEach(l => l(e))
  }
}

export abstract class BaseItemed<T extends Identifiable> extends Base {
  public items:Numbered<T> = {}
  
  constructor() {
    super();
    this.on('item-added', (it:T) => this.onItemAdded(it))
    this.on('item-removed', (it:T) => this.onItemRemoved(it))
  }
  
  onItemAdded(it:T) {
    this.items[it.hash()] = it
  }
  
  onItemRemoved(it:T) {
    delete this.items[it.hash()]
  }
  
  syncItems(all:T[], partial:boolean = false):boolean {
    let toAdd:Numbered<T> = {}
    let toRemove:Numbered<T> = {}
    let out:Numbered<T> = {};
    
    all.forEach(it => {
      let key = it.hash();
      if (!this.items[key]) {
        toAdd[key] = it;
      }
      out[key] = it;
    });      
    
    if (!partial) {
      Object.forEach(this.items, (sc:Screen, k:string) => {
        if (!out[k]) toRemove[k] = sc;
      });
    }
    
    let toAddItems = Object.values(toAdd);
    let toRemoveItems = Object.values(toRemove);
    
    if (toAddItems.length || toRemoveItems.length) {        
      toRemoveItems.forEach(it => this.dispatchEvent("item-removed", it))
      toAddItems.forEach(it => this.dispatchEvent("item-added", it))      
      this.dispatchEvent("changed");
      return true;
    } else {
      return false;
    }        
  }
}