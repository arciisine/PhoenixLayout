/// <reference path="./typings/layout.d.ts" />

Object.values = function<T>(o:Named<T>|Numbered<T>):T[] {
  let out:T[] = [];
  for (let k in o) out.push(o[k]);
  return out;
}

Object.map = function<T,U>(o:Object, fn:(T,any)=>U):Object {
  let out = {};
  for (let k in o) out[k] = fn(o[k], k);
  return out;
}

Object.forEach = function<T>(o:Named<T>, fn:(T,any)=>void):void {
  for (let k in o) fn(o[k], k);
}