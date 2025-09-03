#!/usr/bin/env node

import { test, describe } from 'node:test';
const assert = require('node:assert');
import { deepMixin } from '../../dist/main.js';

describe('Simple Deep Mixin Tests', () => {
  
  test('Function property merging with multiple objects', () => {
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

    (m2.foo as any).bar = 2;

    const m3 = {
      a: '3',
      foo() {
        return 'm3';
      }
    };

    (m3.foo as any).bar = 3;

    const result = deepMixin(m1, m2, m3);
    
    // The last argument (m3) should take precedence
    assert.strictEqual(result.foo(), 'm3', 'Should use the function from the last argument');
    assert.strictEqual((result.foo as any).bar, 3, 'Should use the bar property from the last argument');
  });

  test('Function property preservation', () => {
    const obj1 = {
      fn: function() { return 'original'; }
    };
    (obj1.fn as any).customProp = 'prop1';

    const obj2 = {
      fn: function() { return 'updated'; }
    };
    (obj2.fn as any).customProp = 'prop2';

    const result = deepMixin(obj1, obj2);
    
    assert.strictEqual(result.fn(), 'updated', 'Should use the updated function');
    assert.strictEqual((result.fn as any).customProp, 'prop2', 'Should preserve function properties');
  });

});
