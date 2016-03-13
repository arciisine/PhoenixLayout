/// <reference path="./phoenix.d.ts" />
declare enum Modifier {
  cmd, alt, ctrl, shift
}

declare type Cell = string;

declare type Listener = (e:any) => void

declare interface Named<T> {
  [name:string]:T
}

declare interface Numbered<T> {
  [name:number]:T
}

declare interface ObjectConstructor {
  keys(o:Object):string[]
  values<T>(o:Named<T>|Numbered<T>):T[]
  map<T,U>(o:Named<T>, fn:(T,string)=>U):Named<U>;
  map<T,U>(o:Numbered<T>, fn:(T,number)=>U):Numbered<U>;
  forEach<T>(o:Named<T>, fn:(T,string)=>void):void;
  forEach<T>(o:Numbered<T>, fn:(T,number)=>void):void;
}

declare interface Array<T> {
  matches(others:T[]):boolean;
}

declare interface Math {
  max(...a:number[]):number 
}

declare interface ScreenLayoutExternal {
  format   : string, 
  aliases  : Named<string[]>, 
  padding? : number
}

declare interface Classification {
  id         : string,
  target     : string,
  app?       : RegExp, 
  window?    : RegExp, 
  windowNot? : RegExp,
  tile?      : {x?:boolean, y?:boolean}
}

declare interface ClassificationExternal {
  app?       : RegExp|string, 
  window?    : RegExp|string, 
  windowNot? : RegExp|string,
  tile?      : {x?:boolean, y?:boolean}
}

declare interface Monitor {
  name? : string, 
  size  : string 
}

declare interface Configuration {
  screens : Named<Monitor>,
  classes : Named<ClassificationExternal[]>,
  layouts : Named<Named<ScreenLayoutExternal>>
}

declare var phoenixConfig:Configuration

declare interface ClassifiedAssign {
  cls:Classification, windows:Window[]
}


declare function require(name:string);
declare function require_(name:string);