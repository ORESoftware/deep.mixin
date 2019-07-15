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
    foo() {
      return 'm1';
    },
    cat: {
      fark: '3',
      snake: 5
    }
  }
};

const dog = v1.dog;
const foo = dog.foo;
const cat = dog.cat;

v1.dog.foo.big = 8;

const v2 = {
  dog: {
    foo() {
      return this.cat.snake;
    },
    bar() {
      return this.cat.fark;
    },
    cat: {
      snake: 7
    }
  }
};

const dog2 = v2.dog;
const foo2 = dog2.foo;
const cat2 = dog2.cat;


console.log('result:', deepMixin(v1, v2));


assert(dog === v1.dog);
assert(cat === v1.dog.cat);
assert(foo === v1.dog.foo);


assert(dog2 === v2.dog);
assert(cat2 === v2.dog.cat);
assert(foo2 === v2.dog.foo);


// assert(deepMixin({}, v1, v2).dog.cat !== v1.dog.cat);

const res = deepMixin(v1, v2);

assert(res.dog.bird === 2);

console.log('res:', res);

const fnRes = res.dog.foo();

console.log('fn res:', fnRes);

assert(fnRes === 7);

assert(res.dog.bar() === '3');

console.log(res.dog.foo.big);

//
// assert(deepMixin({}, v1, v2).dog.foo !== foo);
// assert(deepMixin({}, v1, v2).dog.foo !== v1.dog.foo);


clearTimeout(to);
