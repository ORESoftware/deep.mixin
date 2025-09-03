#!/usr/bin/env node

import { test, describe } from 'node:test';
const assert = require('node:assert');
import { deepMixin } from '../../dist/main.js';

describe('First Deep Mixin Tests', () => {
  
  test('Complex nested object merging with shared references', () => {
    const z = { c: 5, d: 333, g: 888 };
    const v = {};
    
    const result = deepMixin(v, { a: { b: z } }, { a: { e: z, b: { c: 3, d: 44 } } });
    
    // Test that the shared reference z is properly handled
    assert.strictEqual(result.a.b.c, 3, 'Should use the updated c value from the last argument');
    assert.strictEqual(result.a.b.d, 44, 'Should use the updated d value from the last argument');
    // Note: result.a.b doesn't have g because it was replaced by the new object { c: 3, d: 44 }
    assert.strictEqual(result.a.e.c, 5, 'Should preserve the original z object in e');
    assert.strictEqual(result.a.e.d, 333, 'Should preserve the original z object in e');
    assert.strictEqual(result.a.e.g, 888, 'Should preserve the original z object in e');
  });

  test('Function merging with different names', () => {
    const m1 = {
      a: '3',
      foo() {
        return 'm1';
      }
    };

    const m2 = {
      a: '3',
      fo() {  // Different function name
        return 'm2';
      }
    };

    const result = deepMixin(m1, m2);
    
    // Both functions should be preserved since they have different names
    assert.strictEqual(result.foo(), 'm1', 'Should preserve foo from m1');
    assert.strictEqual(result.fo(), 'm2', 'Should preserve fo from m2');
    assert.strictEqual(result.a, '3', 'Should preserve the a property');
  });

  test('Empty object as first argument', () => {
    const empty = {};
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    
    const result = deepMixin(empty, obj1, obj2);
    
    assert.strictEqual(result.a, 1, 'Should add a from obj1');
    assert.strictEqual(result.b.c, 2, 'Should add b.c from obj1');
    assert.strictEqual(result.b.d, 3, 'Should add b.d from obj2');
    assert.strictEqual(result.e, 4, 'Should add e from obj2');
  });

});
