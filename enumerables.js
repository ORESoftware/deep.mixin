

const c = {};
const s = Symbol();
c[s] = true;

// how can I clone c's properties including the symbol properties?

// if I do:

for(const [k,v] of Object.entries(c)){
  console.log(k,v);
}

for(const k of Object.getOwnPropertySymbols(c)){
  console.log(k,c[k]);
}

// that won't get my non-enumerable properties like symbols?


