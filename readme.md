
<div align="right">

Travis build status:
[![Build Status](https://travis-ci.org/ORESoftware/typescript-library-skeleton.svg?branch=master)](https://travis-ci.org/ORESoftware/typescript-library-skeleton)

CircleCI build status:
[![CircleCI](https://circleci.com/gh/ORESoftware/typescript-library-skeleton/tree/master.svg?style=svg)](https://circleci.com/gh/ORESoftware/typescript-library-skeleton/tree/master)

</div>

##  Deep.Mixin on NPM

### 
> Why? Because Object.assign is lacking

### Design

> Deep.Mixin is immutable only, unlike Object.assign. Deep.Mixin will copy sub-properties of objects, instead of only
> handling top-level properties, when doing a merge.


### Basic Usage

```js

import deepMixin from '@oresoftware/deep.mixin';

const v1 = {/* some object */};
const v2 = {/* some object */};
const v3 = deepMixin(v1,v2);  

```


```js
const {deepMixin} = require('@oresoftware/deep.mixin');

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

{
  dog: {
    foo: [Function: foo] { big: 8 },
    cat: { snake: 7, fark: '3' },
    bird: 2
  }
}
```

