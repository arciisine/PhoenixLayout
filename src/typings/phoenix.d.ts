/// <reference path="../../node_modules/typescript/lib/lib.core.es6.d.ts" />

declare class Storage {
  static set(key:string, value:any);
  static get(key:string):any;
  static remove(key:string);
} 

declare interface Size {
  width:number;
  height:number;
}

declare interface Point {
  x:number;
  y:number;
}

declare interface Rectangle extends Size,Point {
  width:number;
  height:number;
  x:number;
  y:number;
}

declare interface Identifiable {
  hash():number;
  // isEqual(o:any):boolean;
}

declare interface PIterable<T> {
  next():T;
  previous():T;
}


declare class Key implements Identifiable {
  static on(key:string, modifiers:string[], callback:Function):number;
  static off(identifier:number);

  key:string;
  modifiers:string[];

  constructor(key:string, modifiers:string[], callback:Function);
  hash():number;
  isEnabled():boolean;
  enable():boolean;
  disable():boolean;
}

declare class Event implements Identifiable {
  static on(event:string, callback:Function):number;
  static off(identifier:number);

  name:string;
  constructor(event:string, callback:Function);
  hash():number
  disable():void;
}

declare class Timer implements Identifiable {
  static after(interval:number, callback:Function):number;
  static every(interval:number, callback:Function):number;
  static off(identifier:number);

  constructor(interval:number, repeats:boolean, callback:Function)
  hash():number
  stop():void
}

declare class Task implements Identifiable {
  static run(path:string, args:any[], callback:Function);
  static terminate(identifier:number):void

  status:number;
  output:string;
  error:string;

  constructor(path:string, args:any[], callback:Function);
  hash():number
  terminate():void
}

declare class Modal implements Identifiable {
  origin:Point;
  duration:number;
  weight:number;
  appearance:string;
  icon:any;
  text:string;

  hash():number
  frame():Rectangle
  show()
  close()
}

declare class Command {
  static run(path:string, args:any[]):boolean
}

declare type Direction = 'north'|'east'|'west'|'south';

declare class Window implements Identifiable {

  static focused():Window;
  static all(optionals?:{visible?:boolean}):Window[];
  static recent():Window[];

  hash():number
  others(optionals?:{visible?:boolean, screen?:Screen}):Window[]
  title():string
  isMain():boolean
  isNormal():boolean
  isFullScreen():boolean
  isMinimized():boolean
  isVisible():boolean
  app():App
  screen():Screen
  spaces():Space[]
  topLeft():Point
  size():Size
  frame():Rectangle
  setTopLeft(point:Point):boolean
  setSize(size:Size):boolean
  setFrame(frame:Rectangle):boolean
  setFullScreen(state:boolean):void
  maximise():boolean
  minimise():boolean
  unminimise():boolean
  neighbours(direction:Direction):Window[]
  focus():boolean
  focusClosestNeighbour(direction:Direction):boolean;
}

declare class Space implements Identifiable, PIterable<Space> {
  previous():Space
  next():Space
  hash():number
  isNormal():boolean 
  isFullScreen():boolean 
  screen():Screen 
  windows(optionals?:{visible?:boolean}):Window[]
  addWindows(windows:Window[])
  removeWindows(windows:Window[])
}

declare class Screen implements Identifiable, PIterable<Screen> {

  static main():Screen;
  static all():Screen[];

  hash():number
  spaces():Space[]
  currentSpace():Space
  
  frame():Rectangle 
  visibleFrame():Rectangle
  flippedFrame():Rectangle
  flippedVisibleFrame():Rectangle
  next():Screen
  previous():Screen
  windows(optionals?:{visible?:boolean}):Window[]
}

declare class Mouse {
  static location():Point;
  static moveTo(point:Point):boolean; 
}

declare class App implements Identifiable {

  static get(appName:string):App;
  static launch(appName:string):App;
  static focused():App;
  static all():App[];

  hash():number
  processIdentifier():number;
  bundleIdentifier():string;
  name():string;
  icon():any;
  isActive():boolean;
  isHidden():boolean;
  isTerminated():boolean;
  mainWindow():Window;
  windows(optional?:{visible?:boolean}):Window[];
  activate():boolean;
  focus():boolean;
  show():boolean;
  hide():boolean;
  terminate(optional?:{force?:boolean}):boolean;
}

declare class Phoenix {
  static reload();
  static set(preferences:{[key:string]:any});  
  static log(message:string);
  static notify(message:string);
}