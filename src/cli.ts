#!/usr/bin/env node
'use strict';

console.log('this is your command line app.');


const v = <A, B, C, D>(a: A, b?: B, c?: C, d?: D):  D & C & B & A => {
  return Object.assign(a, b, c, d);
};


console.log(v({a: 'foo'}, {a: 5}, {a(){ return {toFixed(){return 'foo'}}}}).a().toFixed());



const d = <A, B, C, D>(a: A, b?: B, c?: C, d?: D):  D | C | B | A => {
  return Object.assign(a, b, c, d);
};


// console.log(d({a: 'foo'}, {a: 5}, {a(){ return {toFixed(){return 'foo'}}}}).a().toFixed());
