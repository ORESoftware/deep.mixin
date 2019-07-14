#!/usr/bin/env node
'use strict';

// see .r2g/tests/smoke-test.1.js for some instructions
// essentially, do not import any code here except core libraries

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
const assert = require('assert');

const v1 = {
  dog: {
    bird: 2,
    foo(){
      return 'm1';
    },
    cat: {
      fark: '3',
      snake: 5
    }
  }
};

const foo = v1.dog.foo;

const v2 = {
  dog: {
    foo(){
      return 'm2';
    },
    cat: {
      snake: 7
    }
  }
};

assert(deepMixin({}, v1, v2).dog.cat !== v1.dog.cat);
assert(deepMixin({}, v1, v2).dog.foo() === 'm2');

assert(deepMixin({}, v1, v2).dog.foo !== foo);
assert(deepMixin({}, v1, v2).dog.foo !== v1.dog.foo);


clearTimeout(to);
