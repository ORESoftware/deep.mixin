'use strict';


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};


type HasIndex = { [key: string]: any };


const copyObject = (a: HasIndex) => {

  const ret = {} as any;

  for (const [k, v] of Object.entries(a)) {
    ret[k] = copy(v);
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    ret[k] = copy(a[k as any])
  }

  return Object.setPrototypeOf(ret, Object.getPrototypeOf(a));

};

const copyArray = (a: HasIndex) => {

  const ret = a.slice(0);

  for (const [k, v] of Object.entries(a)) {
    ret[k] = copy(v);
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    ret[k] = copy(a[k as any])
  }

  // this call is unnecessary here: Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
  // since Array.prototype.slice will call a constructor
  return ret;

};

const copyFunction = (fn: Function) => {

  const ret = <any>function () {
    return fn.apply(this, arguments);
  };

  for (const [k, v] of Object.entries(fn)) {
    ret[k] = copy(v);
  }

  for (const k of Object.getOwnPropertySymbols(fn)) {
    ret[k] = copy((fn as any)[k as any])
  }

  return Object.setPrototypeOf(ret, Object.getPrototypeOf(fn));

};


const copy = (v: any) => {

  if (Array.isArray(v)) {
    if (typeof v === 'function') {
      throw 'Internal library problem - object is array and a function.';
    }
    return copyArray(v);
  }

  if (v && typeof v === 'function') {
    return copyFunction(v);
  }

  if (v && typeof v === 'object') {
    return copyObject(v);
  }

  return v;

};


const canHaveProperties = (val: any) => {
  return val && (typeof val === 'object' || typeof val === 'function');
};


const mixin = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {

  if(!(b && typeof b === 'object')){
    return a;
  }

  if(Array.isArray(b)){
    return a;
  }

  for (const [key, val] of Object.entries(b)) {

    let hasOwnProp = false;

    try {
      hasOwnProp = a.hasOwnProperty(key);
    } catch (err) {
      continue;
    }

    if (!canHaveProperties(val)) {
      if (!hasOwnProp) {
        a[key] = val;
      }
      continue;
    }

    if (!hasOwnProp) {

      if (s.has(val)) {
        a[key] = s.get(val);
        continue;
      }

      s.set(val, a[key] = copy(val));
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixin(a[key], val, s);
    }

  }

  return a;

};


export const deepMixinTyped = function <A, B, C, D, E>(a: A, b?: B, c?: C, d?: D, ...args: E[]): A & B & C & D & E {
  return Array.from(arguments).reduceRight((a, b) => mixin(a, b, new Map()), {});
};


export const deepMixin = (...v: object[]) => {
  return v.reduceRight((a, b) => mixin(a, b, new Map()), {});
};


export const deepMixinRight = (...v: object[]) => {
  return v.reduce((a, b) => mixin(a, b, new Map()), {});
};


export default deepMixin;



