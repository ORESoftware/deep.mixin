#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const assert = require('assert');
const EE = require('events');
const strm = require('stream');

const {deepMixin} = require('@oresoftware/deep.mixin');

//
// const z = {c: 5, d: 333, g: 888};
// const v = {};
//
// console.log(deepMixin(v, {a: {b: z}}, {a: {e: z, b: {c: 3, d: 44}}}));

const m1 = {
  a: '3', foo() {
    return 'm1';
  }
};

const m2 = {
  a: '3', foo() {
    return 'm2';
  }
};

m2.foo.bar = 2;

const m3 = {
  a: '3', foo() {
    return 'm3';
  }
};

m3.foo.bar = 3;


console.log(deepMixin(m1, m2, m3).foo());  // m3
console.log(deepMixin(m1, m2, m3).foo.bar);  // 3

// works, but why
