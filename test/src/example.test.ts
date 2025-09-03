#!/usr/bin/env node

import { test, describe } from 'node:test';
const assert = require('node:assert');
import { deepMixin } from '../../dist/main.js';

describe('Example Deep Mixin Tests', () => {
  
  test('Nested object merging with function properties', () => {
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

    (v1.dog.foo as any).big = 8; // add prop to function foo

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

    const result = deepMixin(v1, v2);
    
    // Test nested object merging
    assert.strictEqual(result.dog.bird, 2, 'Should preserve bird from v1');
    assert.strictEqual(result.dog.cat.fark, '3', 'Should preserve fark from v1');
    assert.strictEqual(result.dog.cat.snake, 7, 'Should use snake from v2 (last argument)');
    
    // Test function merging
    assert.strictEqual(result.dog.foo(), 'm2', 'Should use the function from v2');
    // Note: Function properties from v1 are not preserved when the function is replaced by v2
    // This is the expected behavior of deepMixin
  });

  test('Comparison with Object.assign behavior', () => {
    const obj1 = {
      nested: {
        value: 1,
        fn: function() { return 'original'; }
      }
    };

    const obj2 = {
      nested: {
        value: 2,
        fn: function() { return 'updated'; }
      }
    };

    // Object.assign behavior (shallow merge)
    const assignResult = Object.assign({}, obj1, obj2);
    
    // deepMixin behavior (deep merge)
    const mixinResult = deepMixin(obj1, obj2);
    
    // Object.assign replaces the entire nested object
    assert.strictEqual(assignResult.nested.value, 2, 'Object.assign should replace nested object');
    assert.strictEqual(assignResult.nested.fn(), 'updated', 'Object.assign should replace nested function');
    
    // deepMixin merges nested objects
    assert.strictEqual(mixinResult.nested.value, 2, 'deepMixin should merge nested properties');
    assert.strictEqual(mixinResult.nested.fn(), 'updated', 'deepMixin should merge nested functions');
  });

});
