'use strict';


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};


type HasIndex = { [key: string]: any };


const copy = (a: HasIndex) => {
  
  const ret = {} as any;
  
  for(const [k,v] of Object.entries(a)){
    ret[k] = v;
  }
  
  return ret;
  
};

const mixin = (a: HasIndex, b: HasIndex, s: Set<any>) => {
  
  // if(typeof a !== 'object'){
  //   return b || {};
  // }
  
  // if(typeof b !== 'object'){
  //   return a || {};
  // }
  
  console.log('a:', a);
  console.log('b:', b);
  console.log('-----------');
  
  for (const [key, val] of Object.entries(b)) {
    
    // console.log('a:', key, a[key]);
    // console.log('b:', key, b[key]);
    
    if (!(val && typeof val === 'object')) {
      a[key] = val;
      continue;
    }
  
    // if (!(val && typeof val === 'function')) {
    //   a[key] = val;
    //   continue;
    // }
    
    if (!a.hasOwnProperty(key)) {
      a[key] = val;
      continue;
    }
    
    if (!(a[key] && typeof a[key] === 'object')) {
      a[key] = val;
      continue;
    }
    
    if (a[key] === val) {
      continue;
    }
    
    // if (s.has(val)) {
    //   a[key] = val;
    //   continue;
    // }
    //
    // s.add(val);
    
    const c = copy(a[key]);
    
    mixin(c, val, s);
    
    a[key] = c;
    
    // a[key] = b[key];
  }
  
  return a;
  
};

// export const deepMixin = (...v: object[]) => {
//   return v.reduce((a, b) => mixin(a, b, new Set()), {});
// };

const assert = require('assert');

export const deepMixin = (...v: object[]) => {
  
  const z = {};
  
  return v.reduce((a, b) => {
    assert(a === z);
    return mixin(a, b, new Set())
  }, z);
  
  
};

export default deepMixin;



