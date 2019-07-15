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
      return 'm2';
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

assert(fnRes === 'm2');

console.log(res.dog.foo.big);

//
// assert(deepMixin({}, v1, v2).dog.foo !== foo);
// assert(deepMixin({}, v1, v2).dog.foo !== v1.dog.foo);
