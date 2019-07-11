'use strict';


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};


type HasIndex = {[key:string]: any};

const mixin = (a:HasIndex, b:HasIndex, s: Set<any>) => {
  
  for (let [key, val] of Object.entries(b)) {
    
    if (typeof val !== 'object' || val === null) {
      a[key] = b[key];
      continue;
    }
    
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key];
      continue;
    }
    
    if (s.has(b[key])) {
      a[key] = b[key];
      continue;
    }
    
    s.add(b[key]);
    
    mixin(a[key], b[key], s);
  }
  
  return a;
  
};

export const deepMixin = (...v: object[]) => {
  return v.reduce((a, b) => mixin(a, b, new Set()), {});
};

export default deepMixin;



