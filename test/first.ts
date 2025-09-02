#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const assert = require('assert');
const EE = require('events');
const strm = require('stream');

const {deepMixin} = require('../dist/main.js');

const z = {c: 5, d: 333, g: 888};
const v = {};

console.log(deepMixin(v, {a: {b: z}}, {a: {e: z, b: {c: 3, d: 44}}}));

const m1 = {
  a: '3', foo() {
    console.log('m1');
  }
};

const m2 = {
  a: '3', fo() {
    console.log('m2');
  }
};

console.log(deepMixin(m1, m2).foo());
