import { canHaveProperties } from './merge';
import type { HasIndex } from './types';

const copyClean = (v: any, s: Map<any, any>) => {
  // Skip Maps, Sets, and Functions entirely
  if (v instanceof Map || v instanceof Set || (v && typeof v === 'function')) {
    return undefined;
  }

  // Handle Date objects
  if (v instanceof Date) {
    return new Date(v.getTime());
  }

  // Handle RegExp objects
  if (v instanceof RegExp) {
    return new RegExp(v.source, v.flags);
  }

  // Handle ArrayBuffer and TypedArrays
  if (v instanceof ArrayBuffer) {
    return v.slice(0);
  }
  if (v instanceof Uint8Array || v instanceof Uint16Array ||
      v instanceof Uint32Array || v instanceof Int8Array ||
      v instanceof Int16Array || v instanceof Int32Array ||
      v instanceof Float32Array || v instanceof Float64Array) {
    return new (v.constructor as any)(v);
  }

  // Handle arrays
  if (Array.isArray(v)) {
    if (s.has(v)) {
      return s.get(v);
    }
    const ret = v.slice(0);
    s.set(v, ret);
    for (let i = 0; i < v.length; i++) {
      ret[i] = copyClean(v[i], s);
    }
    return ret;
  }

  // Handle plain objects (no prototypes, just top-level properties)
  if (v && typeof v === 'object') {
    if (s.has(v)) {
      return s.get(v);
    }
    const ret = {} as any;
    s.set(v, ret);

    // Only copy own enumerable properties, no prototype
    for (const [k, val] of Object.entries(v)) {
      ret[k] = copyClean(val, s);
    }

    for (const k of Object.getOwnPropertySymbols(v)) {
      ret[k] = copyClean((v as any)[k], s);
    }

    return ret;
  }

  return v;
};

export const mixinClean = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {
  if (!(b && typeof b === 'object')) {
    return a;
  }

  if (Array.isArray(b)) {
    return a;
  }

  // Skip Maps, Sets, and Functions entirely
  if (b instanceof Map || b instanceof Set || typeof b === 'function') {
    return a;
  }

  // Check for circular reference
  if (s.has(b)) {
    return s.get(b);
  }

  // Add to circular reference map before processing
  s.set(b, a);

  // Handle string keys - only copy own enumerable properties
  for (const [key, val] of Object.entries(b)) {
    // Skip Maps, Sets, and Functions
    if (val instanceof Map || val instanceof Set || typeof val === 'function') {
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
      s.set(val, a[key] = copyClean(val, s));
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixinClean(a[key], val, s);
    }
  }

  // Handle symbol keys - only copy own enumerable properties
  for (const key of Object.getOwnPropertySymbols(b)) {
    const val = (b as any)[key];

    // Skip Maps, Sets, and Functions
    if (val instanceof Map || val instanceof Set || typeof val === 'function') {
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
        (a as any)[key] = val;
      }
      continue;
    }

    if (!hasOwnProp) {
      if (s.has(val)) {
        (a as any)[key] = s.get(val);
        continue;
      }
      s.set(val, (a as any)[key] = copyClean(val, s));
      continue;
    }

    if (canHaveProperties((a as any)[key])) {
      mixinClean((a as any)[key], val, s);
    }
  }

  return a;
};
