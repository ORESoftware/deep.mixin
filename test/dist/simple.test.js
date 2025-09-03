#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_test_1 = require("node:test");
var assert = require('node:assert');
var main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('Simple Deep Mixin Tests', function () {
    (0, node_test_1.test)('Function property merging with multiple objects', function () {
        var m1 = {
            a: '3',
            foo: function () {
                return 'm1';
            }
        };
        var m2 = {
            a: '3',
            foo: function () {
                return 'm2';
            }
        };
        m2.foo.bar = 2;
        var m3 = {
            a: '3',
            foo: function () {
                return 'm3';
            }
        };
        m3.foo.bar = 3;
        var result = (0, main_js_1.deepMixin)(m1, m2, m3);
        // The last argument (m3) should take precedence
        assert.strictEqual(result.foo(), 'm3', 'Should use the function from the last argument');
        assert.strictEqual(result.foo.bar, 3, 'Should use the bar property from the last argument');
    });
    (0, node_test_1.test)('Function property preservation', function () {
        var obj1 = {
            fn: function () { return 'original'; }
        };
        obj1.fn.customProp = 'prop1';
        var obj2 = {
            fn: function () { return 'updated'; }
        };
        obj2.fn.customProp = 'prop2';
        var result = (0, main_js_1.deepMixin)(obj1, obj2);
        assert.strictEqual(result.fn(), 'updated', 'Should use the updated function');
        assert.strictEqual(result.fn.customProp, 'prop2', 'Should preserve function properties');
    });
});
