#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert = require('node:assert');
const main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('First Deep Mixin Tests', () => {
    (0, node_test_1.test)('Complex nested object merging with shared references', () => {
        const z = { c: 5, d: 333, g: 888 };
        const v = {};
        const result = (0, main_js_1.deepMixin)(v, { a: { b: z } }, { a: { e: z, b: { c: 3, d: 44 } } });
        assert.strictEqual(result.a.b.c, 3, 'Should use the updated c value from the last argument');
        assert.strictEqual(result.a.b.d, 44, 'Should use the updated d value from the last argument');
        assert.strictEqual(result.a.e.c, 5, 'Should preserve the original z object in e');
        assert.strictEqual(result.a.e.d, 333, 'Should preserve the original z object in e');
        assert.strictEqual(result.a.e.g, 888, 'Should preserve the original z object in e');
    });
    (0, node_test_1.test)('Function merging with different names', () => {
        const m1 = {
            a: '3',
            foo() {
                return 'm1';
            }
        };
        const m2 = {
            a: '3',
            fo() {
                return 'm2';
            }
        };
        const result = (0, main_js_1.deepMixin)(m1, m2);
        assert.strictEqual(result.foo(), 'm1', 'Should preserve foo from m1');
        assert.strictEqual(result.fo(), 'm2', 'Should preserve fo from m2');
        assert.strictEqual(result.a, '3', 'Should preserve the a property');
    });
    (0, node_test_1.test)('Empty object as first argument', () => {
        const empty = {};
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { b: { d: 3 }, e: 4 };
        const result = (0, main_js_1.deepMixin)(empty, obj1, obj2);
        assert.strictEqual(result.a, 1, 'Should add a from obj1');
        assert.strictEqual(result.b.c, 2, 'Should add b.c from obj1');
        assert.strictEqual(result.b.d, 3, 'Should add b.d from obj2');
        assert.strictEqual(result.e, 4, 'Should add e from obj2');
    });
});
