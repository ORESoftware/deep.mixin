#!/usr/bin/env node
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var http = require('http');
var assert = require('assert');
var EE = require('events');
var strm = require('stream');
var deepMixin = require('deep.mixin').deepMixin;
var z = { c: 5, d: 333, g: 888 };
var v = {};
console.log(deepMixin(v, { a: { b: z } }, { a: { e: z, b: { c: 3, d: 44 } } }));
var m1 = {
    a: '3', foo: function () {
        console.log('m1');
    }
};
var m2 = {
    a: '3', fo: function () {
        console.log('m2');
    }
};
console.log(deepMixin(m1, m2).foo());
