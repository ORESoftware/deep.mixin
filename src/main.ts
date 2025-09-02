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

const copy = (v: any, s: Map<any, any>) => {
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