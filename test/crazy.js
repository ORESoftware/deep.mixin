'use strict';

const {deepMixin} = require('@oresoftware/deep.mixin');
const assert = require('assert');

const copyArray = (a) => {
  
  const ret = a.slice(0);
  
  for (const [k, v] of Object.entries(a)) {
    ret[k] = v;
  }
  
  return ret;
  
};

const z = [1,2,3];

z[0] = 0;
z.foo = 5;

console.log(z.slice(0));

const v = copyArray(z);

console.log(v);
