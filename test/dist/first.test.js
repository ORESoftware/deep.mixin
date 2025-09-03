#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_test_1 = require("node:test");
var assert = require('node:assert');
var main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('First Deep Mixin Tests', function () {
    (0, node_test_1.test)('Complex nested object merging with shared references', function () {
        var z = { c: 5, d: 333, g: 888 };
        var v = {};
        var result = (0, main_js_1.deepMixin)(v, { a: { b: z } }, { a: { e: z, b: { c: 3, d: 44 } } });
        // Test that the shared reference z is properly handled
        assert.strictEqual(result.a.b.c, 3, 'Should use the updated c value from the last argument');
        assert.strictEqual(result.a.b.d, 44, 'Should use the updated d value from the last argument');
        // Note: result.a.b doesn't have g because it was replaced by the new object { c: 3, d: 44 }
        assert.strictEqual(result.a.e.c, 5, 'Should preserve the original z object in e');
        assert.strictEqual(result.a.e.d, 333, 'Should preserve the original z object in e');
        assert.strictEqual(result.a.e.g, 888, 'Should preserve the original z object in e');
    });
    (0, node_test_1.test)('Function merging with different names', function () {
        var m1 = {
            a: '3',
            foo: function () {
                return 'm1';
            }
        };
        var m2 = {
            a: '3',
            fo: function () {
                return 'm2';
            }
        };
        var result = (0, main_js_1.deepMixin)(m1, m2);
        // Both functions should be preserved since they have different names
        assert.strictEqual(result.foo(), 'm1', 'Should preserve foo from m1');
        assert.strictEqual(result.fo(), 'm2', 'Should preserve fo from m2');
        assert.strictEqual(result.a, '3', 'Should preserve the a property');
    });
    (0, node_test_1.test)('Empty object as first argument', function () {
        var empty = {};
        var obj1 = { a: 1, b: { c: 2 } };
        var obj2 = { b: { d: 3 }, e: 4 };
        var result = (0, main_js_1.deepMixin)(empty, obj1, obj2);
        assert.strictEqual(result.a, 1, 'Should add a from obj1');
        assert.strictEqual(result.b.c, 2, 'Should add b.c from obj1');
        assert.strictEqual(result.b.d, 3, 'Should add b.d from obj2');
        assert.strictEqual(result.e, 4, 'Should add e from obj2');
    });
});
