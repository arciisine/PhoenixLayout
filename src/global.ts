/// <reference path="./typings/layout.d.ts" />

Object.values = function<T>(o:Named<T>):T[] {
  let out:T[] = [];
  for (let k in o) out.push(o[k]);
  return out;
}

Object.map = function<T,U>(o:Named<T>, fn:(T,string)=>U):Named<U> {
  let out:Named<U> = {};
  for (let k in o) out[k] = fn(o[k], k);
  return out;
}

Object.forEach = function<T>(o:Named<T>, fn:(T,string)=>void):void {
  for (let k in o) fn(o[k], k);
}

function message(msg) {
  let m = new Modal();
  m.message = msg
  m.duration = 5
  m.show()
}