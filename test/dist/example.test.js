#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert = require('node:assert');
const main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('Example Deep Mixin Tests', () => {
    (0, node_test_1.test)('Nested object merging with function properties', () => {
        const v1 = {
            dog: {
                bird: 2,
                foo() {
                    return 'm1';
                },
                cat: {
                    fark: '3',
                    snake: 5
                }
            }
        };
        v1.dog.foo.big = 8;
        const v2 = {
            dog: {
                foo() {
                    return 'm2';
                },
                cat: {
                    snake: 7
                }
            }
        };
        const result = (0, main_js_1.deepMixin)(v1, v2);
        assert.strictEqual(result.dog.bird, 2, 'Should preserve bird from v1');
        assert.strictEqual(result.dog.cat.fark, '3', 'Should preserve fark from v1');
        assert.strictEqual(result.dog.cat.snake, 7, 'Should use snake from v2 (last argument)');
        assert.strictEqual(result.dog.foo(), 'm2', 'Should use the function from v2');
    });
    (0, node_test_1.test)('Comparison with Object.assign behavior', () => {
        const obj1 = {
            nested: {
                value: 1,
                fn: function () { return 'original'; }
            }
        };
        const obj2 = {
            nested: {
                value: 2,
                fn: function () { return 'updated'; }
            }
        };
        const assignResult = Object.assign({}, obj1, obj2);
        const mixinResult = (0, main_js_1.deepMixin)(obj1, obj2);
        assert.strictEqual(assignResult.nested.value, 2, 'Object.assign should replace nested object');
        assert.strictEqual(assignResult.nested.fn(), 'updated', 'Object.assign should replace nested function');
        assert.strictEqual(mixinResult.nested.value, 2, 'deepMixin should merge nested properties');
        assert.strictEqual(mixinResult.nested.fn(), 'updated', 'deepMixin should merge nested functions');
    });
});
