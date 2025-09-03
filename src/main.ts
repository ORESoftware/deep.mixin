'use strict';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

type HasIndex = { [key: string]: any };

const copyObject = (a: HasIndex, s: Map<any, any>) => {
  if (s.has(a)) {
    return s.get(a);
  }

  const ret = {} as any;
  s.set(a, ret);

  for (const [k, v] of Object.entries(a)) {
    (ret as any)[k] = copy(v, s);
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    (ret as any)[k] = copy(a[k as any], s);
  }

  return Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
};

const copyArray = (a: any[], s: Map<any, any>) => {
  if (s.has(a)) {
    return s.get(a);
  }

  const ret = a.slice(0);
  s.set(a, ret);

  for (const [k, v] of Object.entries(a)) {
    (ret as any)[k] = copy(v, s);
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    (ret as any)[k] = copy(a[k as any], s);
  }

  // this call is unnecessary here: Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
  // since Array.prototype.slice will call a constructor
  return ret;
};

const copyFunction = (fn: Function, s: Map<any, any>) => {
  if (s.has(fn)) {
    return s.get(fn);
  }

  const ret = <any>function () {
    return fn.apply(this, arguments);
  };
  s.set(fn, ret);

  for (const [k, v] of Object.entries(fn)) {
    ret[k] = copy(v, s);
  }

  for (const k of Object.getOwnPropertySymbols(fn)) {
    ret[k] = copy((fn as any)[k as any], s);
  }

  return Object.setPrototypeOf(ret, Object.getPrototypeOf(fn));
};

const copyBuiltInWithProperties = (v: any, newInstance: any, s: Map<any, any>) => {
  if (s.has(v)) {
    return s.get(v);
  }

  s.set(v, newInstance);

  for (const k of Object.keys(v)) {
    newInstance[k] = copy(v[k], s);
  }

  for (const k of Object.getOwnPropertySymbols(v)) {
    newInstance[k] = copy(v[k as any], s);
  }

  return newInstance;
};

const copyBuiltInWithPropertiesNoFunctions = (v: any, newInstance: any, s: Map<any, any>) => {
  if (s.has(v)) {
    return s.get(v);
  }

  s.set(v, newInstance);

  for (const k of Object.keys(v)) {
    const copied = copyNoFunctions(v[k], s);
    if (copied !== undefined || (v[k] !== undefined && typeof v[k] !== 'function')) {
      newInstance[k] = copied;
    }
  }

  for (const k of Object.getOwnPropertySymbols(v)) {
    const copied = copyNoFunctions(v[k as any], s);
    if (copied !== undefined || (v[k as any] !== undefined && typeof v[k as any] !== 'function')) {
      newInstance[k] = copied;
    }
  }

  return newInstance;
};

const copy = (v: any, s: Map<any, any>) => {
  // FIX: Handle Date objects and other built-in objects properly
  if (v instanceof Date) {
    return copyBuiltInWithProperties(v, new Date(v.getTime()), s);
  }

  // FIX: Use Reflect to dynamically handle other built-in objects
  if (v && typeof v === 'object' && v.constructor !== Object && v.constructor !== Array) {
    try {
      // Get the constructor function - handle null prototype
      const proto = Reflect.getPrototypeOf(v);
      if (!proto || !proto.constructor) {
        // Fallback to regular object copying for objects without constructor
        return copyObject(v, s);
      }

      const cnstr = proto.constructor;

      // Check if it's a built-in constructor (not a custom class)
      if (cnstr !== Object && cnstr !== Array && cnstr !== Function) {
        // Check circular reference early
        if (s.has(v)) {
          return s.get(v);
        }

        // Try to create a new instance using the constructor
        if (cnstr === Date) {
          return copyBuiltInWithProperties(v, new Date(v.getTime()), s);
        } else if (cnstr === RegExp) {
          return copyBuiltInWithProperties(v, new RegExp(v.source, v.flags), s);
        } else if (cnstr === Map) {
          const newMap = new Map();
          s.set(v, newMap);
          for (const [key, value] of v.entries()) {
            newMap.set(copy(key, s), copy(value, s));
          }
          // Copy any custom properties on the Map object itself
          for (const k of Object.keys(v)) {
            (newMap as any)[k] = copy(v[k], s);
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            (newMap as any)[k] = copy(v[k as any], s);
          }
          return newMap;
        } else if (cnstr === Set) {
          const newSet = new Set();
          s.set(v, newSet);
          for (const value of v.values()) {
            newSet.add(copy(value, s));
          }
          // Copy any custom properties on the Set object itself
          for (const k of Object.keys(v)) {
            (newSet as any)[k] = copy(v[k], s);
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            (newSet as any)[k] = copy(v[k as any], s);
          }
          return newSet;
        } else if (cnstr === ArrayBuffer) {
          return copyBuiltInWithProperties(v, v.slice(0), s);
        } else if (cnstr === Uint8Array || cnstr === Uint16Array ||
          cnstr === Uint32Array || cnstr === Int8Array ||
          cnstr === Int16Array || cnstr === Int32Array ||
          cnstr === Float32Array || cnstr === Float64Array) {
          // @ts-ignore
          return copyBuiltInWithProperties(v, new cnstr(v), s);
        }

        // For other built-in objects, try constructor-based approach
        try {
          // @ts-ignore
          const x = new cnstr(v);
          s.set(v, x);

          for (const k of Object.keys(v)) {
            x[k] = copy(v[k], s);
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            x[k] = copy(v[k as any], s);
          }
          return x;
        } catch (e) {
          // Fall back to regular object copying if constructor fails
        }
      }

    } catch (e) {
      // If Reflect fails, fall back to regular object copying
      console.warn('Reflect failed, falling back to object copy');
    }
  }

  if (Array.isArray(v)) {
    if (typeof v === 'function') {
      throw 'Internal library problem - object is array and a function.';
    }
    return copyArray(v, s);
  }

  if (v && typeof v === 'function') {
    return copyFunction(v, s);
  }

  if (v && typeof v === 'object') {
    return copyObject(v, s);
  }

  return v;
};

const copyNoFunctions = (v: any, s: Map<any, any>) => {
  // FIX: Handle Date objects and other built-in objects properly
  if (v instanceof Date) {
    return copyBuiltInWithPropertiesNoFunctions(v, new Date(v.getTime()), s);
  }

  // FIX: Use Reflect to dynamically handle other built-in objects
  if (v && typeof v === 'object' && v.constructor !== Object && v.constructor !== Array) {
    try {
      // Get the constructor function - handle null prototype
      const proto = Reflect.getPrototypeOf(v);
      if (!proto || !proto.constructor) {
        // Fallback to regular object copying for objects without constructor
        return copyObjectNoFunctions(v, s);
      }

      const cnstr = proto.constructor;

      if (cnstr !== Object && cnstr !== Array && cnstr !== Function) {
        // Check circular reference early
        if (s.has(v)) {
          return s.get(v);
        }

        if (cnstr === Date) {
          return copyBuiltInWithPropertiesNoFunctions(v, new Date(v.getTime()), s);
        } else if (cnstr === RegExp) {
          return copyBuiltInWithPropertiesNoFunctions(v, new RegExp(v.source, v.flags), s);
        } else if (cnstr === Map) {
          const newMap = new Map();
          s.set(v, newMap);
          for (const [key, value] of v.entries()) {
            newMap.set(copyNoFunctions(key, s), copyNoFunctions(value, s));
          }
          // Copy any custom properties on the Map object itself (excluding functions)
          for (const k of Object.keys(v)) {
            if (typeof v[k] !== 'function') {
              const copied = copyNoFunctions(v[k], s);
              if (copied !== undefined || (v[k] !== undefined && typeof v[k] !== 'function')) {
                (newMap as any)[k] = copied;
              }
            }
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            if (typeof v[k as any] !== 'function') {
              const copied = copyNoFunctions(v[k as any], s);
              if (copied !== undefined || (v[k as any] !== undefined && typeof v[k as any] !== 'function')) {
                (newMap as any)[k] = copied;
              }
            }
          }
          return newMap;
        } else if (cnstr === Set) {
          const newSet = new Set();
          s.set(v, newSet);
          for (const value of v.values()) {
            newSet.add(copyNoFunctions(value, s));
          }
          // Copy any custom properties on the Set object itself (excluding functions)
          for (const k of Object.keys(v)) {
            if (typeof v[k] !== 'function') {
              const copied = copyNoFunctions(v[k], s);
              if (copied !== undefined || (v[k] !== undefined && typeof v[k] !== 'function')) {
                (newSet as any)[k] = copied;
              }
            }
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            if (typeof v[k as any] !== 'function') {
              const copied = copyNoFunctions(v[k as any], s);
              if (copied !== undefined || (v[k as any] !== undefined && typeof v[k as any] !== 'function')) {
                (newSet as any)[k] = copied;
              }
            }
          }
          return newSet;
        } else if (cnstr === ArrayBuffer) {
          return copyBuiltInWithPropertiesNoFunctions(v, v.slice(0), s);
        } else if (cnstr === Uint8Array || cnstr === Uint16Array ||
          cnstr === Uint32Array || cnstr === Int8Array ||
          cnstr === Int16Array || cnstr === Int32Array ||
          cnstr === Float32Array || cnstr === Float64Array) {
          // @ts-ignore
          return copyBuiltInWithPropertiesNoFunctions(v, new cnstr(v), s);
        }

        // For other built-in objects, try constructor-based approach
        try {
          // @ts-ignore
          const x = new cnstr(v);
          s.set(v, x);

          for (const k of Object.keys(v)) {
            if (typeof v[k] !== 'function') {
              const copied = copyNoFunctions(v[k], s);
              if (copied !== undefined || (v[k] !== undefined && typeof v[k] !== 'function')) {
                x[k] = copied;
              }
            }
          }
          for (const k of Object.getOwnPropertySymbols(v)) {
            if (typeof v[k as any] !== 'function') {
              const copied = copyNoFunctions(v[k as any], s);
              if (copied !== undefined || (v[k as any] !== undefined && typeof v[k as any] !== 'function')) {
                x[k] = copied;
              }
            }
          }
          return x;
        } catch (e) {
          console.warn(`Failed to copy ${cnstr.name}, falling back to object copy`);
        }
      }
    } catch (e) {
      console.warn('Reflect failed, falling back to object copy');
    }
  }

  if (Array.isArray(v)) {
    if (typeof v === 'function') {
      throw 'Internal library problem - object is array and a function.';
    }
    return copyArrayNoFunctions(v, s);
  }

  if (v && typeof v === 'function') {
    return undefined; // Skip functions
  }

  if (v && typeof v === 'object') {
    return copyObjectNoFunctions(v, s);
  }

  return v;
};

const copyObjectNoFunctions = (a: HasIndex, s: Map<any, any>) => {
  if (s.has(a)) {
    return s.get(a);
  }

  const ret = {} as any;
  s.set(a, ret);

  for (const [k, v] of Object.entries(a)) {
    const copied = copyNoFunctions(v, s);
    if (copied !== undefined || (v !== undefined && typeof v !== 'function')) {
      (ret as any)[k] = copied;
    }
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    const copied = copyNoFunctions(a[k as any], s);
    if (copied !== undefined || (a[k as any] !== undefined && typeof a[k as any] !== 'function')) {
      (ret as any)[k] = copied;
    }
  }

  return Object.setPrototypeOf(ret, Object.getPrototypeOf(a));
};

const copyArrayNoFunctions = (a: any[], s: Map<any, any>) => {
  if (s.has(a)) {
    return s.get(a);
  }

  const ret = a.slice(0);
  s.set(a, ret);

  for (const [k, v] of Object.entries(a)) {
    const copied = copyNoFunctions(v, s);
    if (copied !== undefined || (v !== undefined && typeof v !== 'function')) {
      (ret as any)[k] = copied;
    }
  }

  for (const k of Object.getOwnPropertySymbols(a)) {
    const copied = copyNoFunctions(a[k as any], s);
    if (copied !== undefined || (a[k as any] !== undefined && typeof a[k as any] !== 'function')) {
      (ret as any)[k] = copied;
    }
  }

  return ret;
};

const canHaveProperties = (val: any) => {
  return val && (typeof val === 'object' || typeof val === 'function');
};

const mixin = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {
  if (!(b && typeof b === 'object')) {
    return a;
  }

  if (Array.isArray(b)) {
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

      s.set(val, a[key] = copy(val, s));
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixin(a[key], val, s);
    }
  }

  return a;
};

const mixinNoFunctions = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {
  if (!(b && typeof b === 'object')) {
    return a;
  }

  if (Array.isArray(b)) {
    return a;
  }

  for (const [key, val] of Object.entries(b)) {
    // Skip function properties entirely
    if (typeof val === 'function') {
      continue;
    }

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

      s.set(val, a[key] = copyNoFunctions(val, s));
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixinNoFunctions(a[key], val, s);
    }
  }

  return a;
};

export const deepMixinTyped = function <A, B, C, D, E>(a: A, b?: B, c?: C, d?: D, ...args: E[]): A & B & C & D & E {
  const s = new Map();
  return Array.from(arguments).reduceRight((a, b) => mixin(a, b, s), {});
};

export const deepMixin = (...v: object[]) => {
  const s = new Map();
  return v.reduceRight((a, b) => mixin(a, b, s), {});
};

export const deepMixinRight = (...v: object[]) => {
  const s = new Map();
  return v.reduce((a, b) => mixin(a, b, s), {});
};

// New function that excludes functions
export const deepMixinNoFunctions = (...v: object[]) => {
  const s = new Map();
  return v.reduceRight((a, b) => mixinNoFunctions(a, b, s), {});
};

export const deepMixinRightNoFunctions = (...v: object[]) => {
  const s = new Map();
  return v.reduce((a, b) => mixinNoFunctions(a, b, s), {});
};

export default deepMixin;
