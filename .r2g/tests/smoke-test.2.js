#!/usr/bin/env node
'use strict';

// see .r2g/tests/smoke-test.1.js for some instructions
// essentially, do not import any code here except core libraries

const assert = require('assert');

process.on('unhandledRejection', (reason, p) => {
  // note: unless we force process to exit with 1, process may exit with 0 upon an unhandledRejection
  console.error(reason);
  process.exit(1);
});

const to = setTimeout(() => {
  console.error('r2g phase-T test timed out.');
  process.exit(1);
}, 4000);


const {deepMixin} = require('@oresoftware/deep.mixin');


{
  
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
  
  assert.strictEqual(deepMixin(m2, m1).foo(), 'm1');
}



{
  
  const m1 = {
    a: '3',
    foo() {
      return 'm1';
    }
  };
  
  m1.foo.bar = 3;
  
  const m2 = {
    a: '3',
    foo() {
      return 'm2';
    }
  };
  
  m2.foo.bar = 4;
  
  assert.strictEqual(deepMixin(m2, m1).foo.bar, 3);
}


{
  
  const m1 = {
    a: '3',
    foo() {
      return 'm1';
    },
    cat: {
      bird: 4,
      dog: {
      
      }
    }
  };
  
  
  const m2 = {
    a: '3',
    foo() {
      return 'm2';
    },
    cat: {
      bird: '5',
      dog: 3
    }
  };
  

  assert.strictEqual(deepMixin(m2, m1).cat.bird, 4);
  assert.strictEqual(deepMixin(m2, m1).cat.dog, m1.cat.dog);
}


{
  
  const m1 = {
    a: '3',
    foo() {
      return 'm1';
    },
    cat: {
    
    }
  };
  
  
  const m2 = {
    a: '3',
    foo() {
      return 'm2';
    },
    cat: {
      bird: '5',
      dog: 3
    }
  };
  
  
  assert.strictEqual(deepMixin(m2, m1).cat.bird, '5');
  assert.strictEqual(deepMixin(m2, m1).cat.dog, 3);
}

clearTimeout(to);
