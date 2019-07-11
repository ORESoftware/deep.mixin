
<div align="right">

Travis build status:
[![Build Status](https://travis-ci.org/ORESoftware/typescript-library-skeleton.svg?branch=master)](https://travis-ci.org/ORESoftware/typescript-library-skeleton)

CircleCI build status:
[![CircleCI](https://circleci.com/gh/ORESoftware/typescript-library-skeleton/tree/master.svg?style=svg)](https://circleci.com/gh/ORESoftware/typescript-library-skeleton/tree/master)

</div>

##  Deep.Mixin on NPM


### Basic Usage

```js

import deepMixin from 'deep.mixin';

const v1 = {...};
const v2 = {...};


const v3 = deepMixin(v1,v2);  // v2 overwrites what's in v1

```
