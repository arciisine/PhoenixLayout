/// <reference path="../../node_modules/typescript/lib/lib.core.es6.d.ts" />
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

declare interface KeyHandler extends Identifiable {
  key:string;
  modifiers:string[]

  isEnabled():boolean
  enable():boolean
  disable():boolean
}

declare interface EventHandler extends Identifiable {
  name:string;
}

declare interface TimerHandler extends Identifiable {
  stop():void
}

declare class Modal implements Identifiable {
  origin:Point;
  duration:number;
  message:string;

  hash():number
  frame():Rectangle
  show()
  close()
}

declare class Command {
  static run(path:string, args:any[]):boolean
}

declare class Window implements Identifiable {

  static focusedWindow():Window
  static windows():Window[]
  static visibleWindows():Window[]
  static visibleWindowsInOrder():Window[]

  hash():number
  otherWindowsOnSameScreen():Window[]
  otherWindowsOnAllScreens():Window[]
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
  maximize():boolean
  minimize():boolean
  unminimize():boolean
  windowsToWest():Window[]
  windowsToEast():Window[]
  windowsToNorth():Window[]
  windowsToSouth():Window[]
  focus():boolean
  focusClosestWindowInWest():boolean
  focusClosestWindowInEast():boolean
  focusClosestWindowInNorth():boolean
  focusClosestWindowInSouth():boolean
}

declare class Space implements Identifiable, PIterable<Space> {
  previous():Space
  next():Space
  hash():number
  isNormal():boolean 
  isFullScreen():boolean 
  screen():Screen 
  windows():Window[]
  visibleWindows():Window[] 
  addWindows(Awindows:Window[])
  removeWindows(windows:Window[])
}

declare class Screen implements Identifiable, PIterable<Screen> {

  static mainScreen():Screen
  static screens():Screen[]

  hash():number
  spaces():Space[]
  frameInRectangle():Rectangle 
  visibleFrameInRectangle():Rectangle 
  next():Screen
  previous():Screen
  windows():Window[]
  visibleWindows():Window[] 
}

declare class Mouse {
  static location():Point;
  static moveTo(point:Point):boolean; 
}

declare class App implements Identifiable {

  static get(appName:string):App;
  static launch(appName:string):App;
  static focusedApp():App;
  static runningApps():App[];

  hash():number
  processIdentifier():number;
  bundleIdentifier():string;
  name():string;
  isActive():boolean;
  isHidden():boolean;
  isTerminated():boolean;
  mainWindow():Window;
  windows():Window[];
  visibleWindows():Window[];
  activate():boolean;
  focus():boolean;
  show():boolean;
  hide():boolean;
  terminate():boolean;
  forceTerminate():boolean;
}
    
declare class Phoenix {
  static reload();
  static bind(key:string, modifiers:string[], callback:()=>void):KeyHandler;
  static on(event:string, callback:()=>void):EventHandler;
  static on(string:"spacdDidChange", callback:()=>void):EventHandler;
  static on(string:"screensDidChange", callback:()=>void):EventHandler;
  static on(string:"appDidLaunch", callback:(app:App)=>void):EventHandler;
  static on(string:"appDidTerminate", callback:(app:App)=>void):EventHandler;
  static on(string:"appDidHide", callback:(app:App)=>void):EventHandler;
  static on(string:"appDidShow", callback:(app:App)=>void):EventHandler;
  
  static on(string:"windowDidOpen", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidClose", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidFocus", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidMove", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidResize", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidMinimize", callback:(window:Window)=>void):EventHandler;
  static on(string:"windowDidUnminimize", callback:(window:Window)=>void):EventHandler;
  
  static log(message:string);
  static notify(message:string);
  
  static after(interval:number, callback:()=>void):TimerHandler; 
  static every(interval:number, callback:()=>void):TimerHandler;
  static set(preferences:{[key:string]:any}):void
}