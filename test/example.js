

const {deepMixin} = require('../dist/main.js');

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

v1.dog.foo.big = 8; // add prop to function foo

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

console.log(Object.assign({},v1,v2));  // { dog: { foo: [Function: foo], cat: { snake: 7 } } }

console.log(deepMixin(v1,v2));  // next line



