import { copy, copyNoFunctions } from './copy';
import type { HasIndex } from './types';

export const canHaveProperties = (val: any) => {
  return val && (typeof val === 'object' || typeof val === 'function');
};

export const mixin = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {
  if (!(b && typeof b === 'object')) {
    return a;
  }

  if (Array.isArray(b)) {
    return a;
  }

  // Check for circular reference
  if (s.has(b)) {
    return s.get(b);
  }

  // Add to circular reference map before processing
  s.set(b, a);

  // Handle string keys
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

    // Special handling for Map and Set objects
    if (a[key] instanceof Map && val instanceof Map) {
      // Merge Map entries - this will overwrite existing keys
      for (const [mapKey, mapValue] of val.entries()) {
        a[key].set(copy(mapKey, s), copy(mapValue, s));
      }
      // Copy custom properties on the Map object itself
      for (const k of Object.keys(val)) {
        (a[key] as any)[k] = copy((val as any)[k], s);
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        (a[key] as any)[k] = copy((val as any)[k], s);
      }
      continue;
    }

    if (a[key] instanceof Set && val instanceof Set) {
      // Merge Set entries
      for (const setValue of val.values()) {
        a[key].add(copy(setValue, s));
      }
      // Copy custom properties on the Set object itself
      for (const k of Object.keys(val)) {
        (a[key] as any)[k] = copy((val as any)[k], s);
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        (a[key] as any)[k] = copy((val as any)[k], s);
      }
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixin(a[key], val, s);
    }
  }

  // Handle symbol keys
  for (const key of Object.getOwnPropertySymbols(b)) {
    const val = (b as any)[key];
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

      s.set(val, (a as any)[key] = copy(val, s));
      continue;
    }

    // Special handling for Map and Set objects with symbol keys
    if ((a as any)[key] instanceof Map && val instanceof Map) {
      // Merge Map entries - this will overwrite existing keys
      for (const [mapKey, mapValue] of val.entries()) {
        (a as any)[key].set(copy(mapKey, s), copy(mapValue, s));
      }
      // Copy custom properties on the Map object itself
      for (const k of Object.keys(val)) {
        ((a as any)[key] as any)[k] = copy((val as any)[k], s);
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        ((a as any)[key] as any)[k] = copy((val as any)[k], s);
      }
      continue;
    }

    if ((a as any)[key] instanceof Set && val instanceof Set) {
      // Merge Set entries
      for (const setValue of val.values()) {
        (a as any)[key].add(copy(setValue, s));
      }
      // Copy custom properties on the Set object itself
      for (const k of Object.keys(val)) {
        ((a as any)[key] as any)[k] = copy((val as any)[k], s);
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        ((a as any)[key] as any)[k] = copy((val as any)[k], s);
      }
      continue;
    }

    if (canHaveProperties((a as any)[key])) {
      mixin((a as any)[key], val, s);
    }
  }

  return a;
};

export const mixinNoFunctions = (a: HasIndex, b: HasIndex, s: Map<any, any>): any => {
  if (!(b && typeof b === 'object')) {
    return a;
  }

  if (Array.isArray(b)) {
    return a;
  }

  // Check for circular reference
  if (s.has(b)) {
    return s.get(b);
  }

  // Add to circular reference map before processing
  s.set(b, a);

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

    // Special handling for Map and Set objects
    if (a[key] instanceof Map && val instanceof Map) {
      // Merge Map entries
      for (const [mapKey, mapValue] of val.entries()) {
        a[key].set(copyNoFunctions(mapKey, s), copyNoFunctions(mapValue, s));
      }
      // Copy custom properties on the Map object itself (excluding functions)
      for (const k of Object.keys(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            (a[key] as any)[k] = copied;
          }
        }
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            (a[key] as any)[k] = copied;
          }
        }
      }
      continue;
    }

    if (a[key] instanceof Set && val instanceof Set) {
      // Merge Set entries
      for (const setValue of val.values()) {
        a[key].add(copyNoFunctions(setValue, s));
      }
      // Copy custom properties on the Set object itself (excluding functions)
      for (const k of Object.keys(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            (a[key] as any)[k] = copied;
          }
        }
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            (a[key] as any)[k] = copied;
          }
        }
      }
      continue;
    }

    if (canHaveProperties(a[key])) {
      mixinNoFunctions(a[key], val, s);
    }
  }

  // Handle symbol keys
  for (const key of Object.getOwnPropertySymbols(b)) {
    const val = (b as any)[key];
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

      s.set(val, (a as any)[key] = copyNoFunctions(val, s));
      continue;
    }

    // Special handling for Map and Set objects with symbol keys
    if ((a as any)[key] instanceof Map && val instanceof Map) {
      // Merge Map entries
      for (const [mapKey, mapValue] of val.entries()) {
        (a as any)[key].set(copyNoFunctions(mapKey, s), copyNoFunctions(mapValue, s));
      }
      // Copy custom properties on the Map object itself (excluding functions)
      for (const k of Object.keys(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            ((a as any)[key] as any)[k] = copied;
          }
        }
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            ((a as any)[key] as any)[k] = copied;
          }
        }
      }
      continue;
    }

    if ((a as any)[key] instanceof Set && val instanceof Set) {
      // Merge Set entries
      for (const setValue of val.values()) {
        (a as any)[key].add(copyNoFunctions(setValue, s));
      }
      // Copy custom properties on the Set object itself (excluding functions)
      for (const k of Object.keys(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            ((a as any)[key] as any)[k] = copied;
          }
        }
      }
      for (const k of Object.getOwnPropertySymbols(val)) {
        if (typeof (val as any)[k] !== 'function') {
          const copied = copyNoFunctions((val as any)[k], s);
          if (copied !== undefined || ((val as any)[k] !== undefined && typeof (val as any)[k] !== 'function')) {
            ((a as any)[key] as any)[k] = copied;
          }
        }
      }
      continue;
    }

    if (canHaveProperties((a as any)[key])) {
      mixinNoFunctions((a as any)[key], val, s);
    }
  }

  return a;
};
