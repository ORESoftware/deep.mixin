'use strict';

import { mixinClean } from './clean';
import { mixin, mixinNoFunctions } from './merge';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
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

export const deepMixinClean = (...v: object[]) => {
  const s = new Map();
  return v.reduceRight((a, b) => mixinClean(a, b, s), {});
};

export default deepMixin;
