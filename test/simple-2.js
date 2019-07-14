#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const assert = require('assert');
const EE = require('events');
const strm = require('stream');


//
// const z = {c: 5, d: 333, g: 888};
// const v = {};
//
// console.log(deepMixin(v, {a: {b: z}}, {a: {e: z, b: {c: 3, d: 44}}}));


const mixin = (a, b) => {
  
  for (const [key, val] of Object.entries(b)) {
    
    if (!(val && typeof val === 'object')) {
      a[key] = b[key];
      continue;
    }
    
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key];
      continue;
    }
    
    if (!(a[key] && typeof a[key] === 'object')) {
      a[key] = b[key];
      continue;
    }
    
    if (a[key] === b[key]) {
      continue;
    }
    
    mixin(a[key], b[key]);
    
  }
  
  return a;
  
};


const deepMixin = (...v) => {
  return v.reduce((a, b) => mixin(a, b), {});
};


const m1 = {
  a: '1',
  dog: {
    cat: 1
  },
  foo() {
    return 'm1';
  }
};

const m2 = {
  a: '2',
  dog: {
    cat: 2
  },
  foo() {
    return 'm2';
  }
};

m2.foo.bar = 2;


const m3 = {
  a: '3',
  // dog: {
  //   cat: 3
  // },
  foo() {
    return 'm3';
  }
};

m3.foo.bar = 3;


console.log(deepMixin(m1, m2, m3).foo());  // m3
console.log(deepMixin(m1, m2, m3).foo.bar);  // 3
console.log(deepMixin(m1, m2, m3).dog.cat);  // 3
// console.log(deepMixin(m3));


// console.log(Object.assign({}, m1, m2, m3).foo());  // m3
// console.log(Object.assign({}, m1, m2, m3).foo.bar);  // 3

// works, but why
