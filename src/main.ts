'use strict';


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};


type HasIndex = { [key: string]: any };


const copyObject = (a: HasIndex) => {
  
  const ret = {} as any;
  
  for (const [k, v] of Object.entries(a)) {
    ret[k] = v;
  }
  
  return Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
  
};

const copyArray = (a: HasIndex) => {
  
  const ret = a.slice(0);
  
  for (const [k, v] of Object.entries(a)) {
    ret[k] = v;
  }
  
  return Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
  
};

const copyFunction = (fn: Function) => {
  
  const ret = <any>function () {
    return fn.apply(this, arguments);
  };
  
  for (const [k, v] of Object.entries(fn)) {
    ret[k] = v;
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
  
  if (typeof v === 'function') {
    return copyFunction(v);
  }
  
  if (typeof v === 'object') {
    return copyObject(v);
  }
  
  throw 'internal lib error - not object array or function';
  
};


const canHaveProperties = (val: any) => {
  return val && (typeof val === 'object' || typeof val === 'function');
};


const mixin = (a: HasIndex, b: HasIndex, s: Set<any>) => {
  
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
    
    const c = copy(val);
    
    if (!hasOwnProp) {
      a[key] = c;
      continue;
    }
    
    if (canHaveProperties(a[key])) {
      mixin(a[key], c, s);
    }
    
  }
  
  return a;
  
};


export const deepMixin = (...v: object[]) => {
  return v.reduceRight((a, b) => mixin(a, b, new Set()), {});
};

export const deepMixinRight = (...v: object[]) => {
  return v.reduce((a, b) => mixin(a, b, new Set()), {});
};


export default deepMixin;



