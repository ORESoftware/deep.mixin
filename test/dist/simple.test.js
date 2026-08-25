#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert = require('node:assert');
const main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('Simple Deep Mixin Tests', () => {
    (0, node_test_1.test)('Function property merging with multiple objects', () => {
        const m1 = {
            a: '3',
            foo() {
                return 'm1';
            }
        };
        const m2 = {
            a: '3',
            foo() {
                return 'm2';
            }
        };
        m2.foo.bar = 2;
        const m3 = {
            a: '3',
            foo() {
                return 'm3';
            }
        };
        m3.foo.bar = 3;
        const result = (0, main_js_1.deepMixin)(m1, m2, m3);
        assert.strictEqual(result.foo(), 'm3', 'Should use the function from the last argument');
        assert.strictEqual(result.foo.bar, 3, 'Should use the bar property from the last argument');
    });
    (0, node_test_1.test)('Function property preservation', () => {
        const obj1 = {
            fn: function () { return 'original'; }
        };
        obj1.fn.customProp = 'prop1';
        const obj2 = {
            fn: function () { return 'updated'; }
        };
        obj2.fn.customProp = 'prop2';
        const result = (0, main_js_1.deepMixin)(obj1, obj2);
        assert.strictEqual(result.fn(), 'updated', 'Should use the updated function');
        assert.strictEqual(result.fn.customProp, 'prop2', 'Should preserve function properties');
    });
});
