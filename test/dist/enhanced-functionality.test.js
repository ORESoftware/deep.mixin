#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert = require('node:assert');
const main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('Enhanced Deep Mixin Functionality', () => {
    (0, node_test_1.test)('Basic deep mixin functionality', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { b: { d: 3 }, e: 4 };
        const result = (0, main_js_1.deepMixin)(obj1, obj2);
        assert.strictEqual(result.a, 1, 'Should preserve obj1.a');
        assert.strictEqual(result.b.c, 2, 'Should preserve obj1.b.c');
        assert.strictEqual(result.b.d, 3, 'Should add obj2.b.d');
        assert.strictEqual(result.e, 4, 'Should add obj2.e');
    });
    (0, node_test_1.test)('Date object handling', () => {
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-12-31');
        const objWithDate1 = { timestamp: date1, name: 'test1' };
        const objWithDate2 = { timestamp: date2, name: 'test2' };
        const result = (0, main_js_1.deepMixin)(objWithDate1, objWithDate2);
        assert(result.timestamp instanceof Date, 'Should preserve Date type');
        assert.strictEqual(result.timestamp.getTime(), date2.getTime(), 'Should use the later date');
        assert.strictEqual(result.name, 'test2', 'Should use the later name');
    });
    (0, node_test_1.test)('RegExp object handling', () => {
        const regex1 = /hello/gi;
        const regex2 = /world/g;
        const objWithRegex1 = { pattern: regex1, flag: 'test1' };
        const objWithRegex2 = { pattern: regex2, flag: 'test2' };
        const result = (0, main_js_1.deepMixin)(objWithRegex1, objWithRegex2);
        assert(result.pattern instanceof RegExp, 'Should preserve RegExp type');
        assert.strictEqual(result.pattern.source, 'world', 'Should use the later regex source');
        assert.strictEqual(result.pattern.flags, 'g', 'Should use the later regex flags');
        assert.strictEqual(result.flag, 'test2', 'Should use the later flag');
    });
    (0, node_test_1.test)('Map object handling', () => {
        const map1 = new Map([['key1', 'value1'], ['key2', 'value2']]);
        const map2 = new Map([['key2', 'updated_value2'], ['key3', 'value3']]);
        const objWithMap1 = { data: map1, id: 1 };
        const objWithMap2 = { data: map2, id: 2 };
        const result = (0, main_js_1.deepMixin)(objWithMap1, objWithMap2);
        assert(result.data instanceof Map, 'Should preserve Map type');
        assert.strictEqual(result.data.get('key1'), 'value1', 'Should preserve key1 from map1');
        assert.strictEqual(result.data.get('key2'), 'value2', 'Should preserve key2 from map1 (first argument takes precedence)');
        assert.strictEqual(result.data.get('key3'), 'value3', 'Should add key3 from map2');
        assert.strictEqual(result.id, 2, 'Should use the later id');
    });
    (0, node_test_1.test)('Set object handling', () => {
        const set1 = new Set(['a', 'b', 'c']);
        const set2 = new Set(['c', 'd', 'e']);
        const objWithSet1 = { items: set1, count: 3 };
        const objWithSet2 = { items: set2, count: 3 };
        const result = (0, main_js_1.deepMixin)(objWithSet1, objWithSet2);
        assert(result.items instanceof Set, 'Should preserve Set type');
        assert(result.items.has('a'), 'Should preserve a from set1');
        assert(result.items.has('b'), 'Should preserve b from set1');
        assert(result.items.has('c'), 'Should preserve c from both sets');
        assert(result.items.has('d'), 'Should add d from set2');
        assert(result.items.has('e'), 'Should add e from set2');
        assert.strictEqual(result.count, 3, 'Should use the later count');
    });
    (0, node_test_1.test)('ArrayBuffer and TypedArray handling', () => {
        const buffer1 = new ArrayBuffer(8);
        const buffer2 = new ArrayBuffer(16);
        const view1 = new Uint8Array(buffer1);
        const view2 = new Uint16Array(buffer2);
        view1[0] = 42;
        view2[0] = 1000;
        const objWithBuffer1 = { buffer: buffer1, view: view1, type: 'uint8' };
        const objWithBuffer2 = { buffer: buffer2, view: view2, type: 'uint16' };
        const result = (0, main_js_1.deepMixin)(objWithBuffer1, objWithBuffer2);
        assert(result.buffer instanceof ArrayBuffer, 'Should preserve ArrayBuffer type');
        assert(result.view instanceof Uint16Array, 'Should preserve TypedArray type');
        assert.strictEqual(result.view[0], 1000, 'Should use the later view data');
        assert.strictEqual(result.type, 'uint16', 'Should use the later type');
    });
    (0, node_test_1.test)('Circular reference handling', () => {
        const circular1 = { name: 'obj1' };
        const circular2 = { name: 'obj2' };
        circular1.ref = circular1;
        circular2.ref = circular2;
        const result = (0, main_js_1.deepMixin)(circular1, circular2);
        assert.strictEqual(result.name, 'obj2', 'Should use the later name');
        assert.strictEqual(result.ref, result, 'Should handle circular reference correctly');
    });
    (0, node_test_1.test)('Function property handling', () => {
        const func1 = function () { return 'func1'; };
        const func2 = function () { return 'func2'; };
        func1.customProp = 'prop1';
        func2.customProp = 'prop2';
        const objWithFunc1 = { fn: func1, id: 1 };
        const objWithFunc2 = { fn: func2, id: 2 };
        const result = (0, main_js_1.deepMixin)(objWithFunc1, objWithFunc2);
        assert(typeof result.fn === 'function', 'Should preserve function type');
        assert.strictEqual(result.fn(), 'func2', 'Should use the later function');
        assert.strictEqual(result.fn.customProp, 'prop2', 'Should preserve function properties');
        assert.strictEqual(result.id, 2, 'Should use the later id');
    });
    (0, node_test_1.test)('deepMixinNoFunctions functionality', () => {
        const objWithFunc3 = {
            data: { value: 1 },
            fn: function () { return 'should be excluded'; },
            regular: 'keep this'
        };
        const objWithFunc4 = {
            data: { value: 2 },
            fn: function () { return 'should also be excluded'; },
            regular: 'keep this too'
        };
        const result = (0, main_js_1.deepMixinNoFunctions)(objWithFunc3, objWithFunc4);
        assert.strictEqual(result.data.value, 2, 'Should mix non-function properties');
        assert.strictEqual(result.regular, 'keep this too', 'Should use the later regular property');
        assert.strictEqual(result.fn, undefined, 'Should exclude functions');
    });
    (0, node_test_1.test)('deepMixinRight functionality', () => {
        const leftObj = { a: 1, b: { c: 2 } };
        const rightObj = { b: { d: 3 }, e: 4 };
        const result = (0, main_js_1.deepMixinRight)(leftObj, rightObj);
        assert.strictEqual(result.a, 1, 'Should preserve leftObj.a');
        assert.strictEqual(result.b.c, 2, 'Should preserve leftObj.b.c');
        assert.strictEqual(result.b.d, 3, 'Should add rightObj.b.d');
        assert.strictEqual(result.e, 4, 'Should add rightObj.e');
    });
    (0, node_test_1.test)('Complex nested object with multiple built-in types', () => {
        const complex1 = {
            metadata: {
                created: new Date('2023-01-01'),
                tags: new Set(['tag1', 'tag2']),
                config: new Map([['setting1', 'value1']]),
                pattern: /test/gi
            },
            data: new Uint8Array([1, 2, 3]),
            name: 'complex1'
        };
        const complex2 = {
            metadata: {
                created: new Date('2023-12-31'),
                tags: new Set(['tag2', 'tag3']),
                config: new Map([['setting2', 'value2']]),
                pattern: /updated/g
            },
            data: new Uint8Array([4, 5, 6]),
            name: 'complex2'
        };
        const result = (0, main_js_1.deepMixin)(complex1, complex2);
        assert(result.metadata.created instanceof Date, 'Should preserve Date in nested object');
        assert(result.metadata.tags instanceof Set, 'Should preserve Set in nested object');
        assert(result.metadata.config instanceof Map, 'Should preserve Map in nested object');
        assert(result.metadata.pattern instanceof RegExp, 'Should preserve RegExp in nested object');
        assert(result.data instanceof Uint8Array, 'Should preserve TypedArray in nested object');
        assert(result.metadata.tags.has('tag1'), 'Should preserve tag1 from complex1');
        assert(result.metadata.tags.has('tag3'), 'Should add tag3 from complex2');
        assert.strictEqual(result.metadata.config.get('setting1'), 'value1', 'Should preserve setting1 from complex1');
        assert.strictEqual(result.metadata.config.get('setting2'), 'value2', 'Should add setting2 from complex2');
        assert.strictEqual(result.name, 'complex2', 'Should use the later name');
    });
    (0, node_test_1.test)('Custom properties on built-in objects', () => {
        const mapWithProps = new Map([['key', 'value']]);
        mapWithProps.customProp = 'customValue';
        mapWithProps.customMethod = function () { return 'customMethod'; };
        const setWithProps = new Set(['item1']);
        setWithProps.customProp = 'setCustomValue';
        const objWithCustomProps1 = { map: mapWithProps, set: setWithProps };
        const objWithCustomProps2 = { map: new Map([['newKey', 'newValue']]), set: new Set(['newItem']) };
        const result = (0, main_js_1.deepMixin)(objWithCustomProps1, objWithCustomProps2);
        assert(result.map instanceof Map, 'Should preserve Map type');
        assert(result.set instanceof Set, 'Should preserve Set type');
        assert.strictEqual(result.map.customProp, 'customValue', 'Should preserve custom properties on Map');
        assert(typeof result.map.customMethod === 'function', 'Should preserve custom methods on Map');
        assert.strictEqual(result.set.customProp, 'setCustomValue', 'Should preserve custom properties on Set');
    });
    (0, node_test_1.test)('Symbol properties handling', () => {
        const sym1 = Symbol('test1');
        const sym2 = Symbol('test2');
        const objWithSymbols1 = { [sym1]: 'value1', regular: 'prop1' };
        const objWithSymbols2 = { [sym2]: 'value2', regular: 'prop2' };
        const result = (0, main_js_1.deepMixin)(objWithSymbols1, objWithSymbols2);
        assert.strictEqual(result[sym1], 'value1', 'Should preserve symbol property from obj1');
        assert.strictEqual(result[sym2], 'value2', 'Should add symbol property from obj2');
        assert.strictEqual(result.regular, 'prop2', 'Should use the later regular property');
    });
    (0, node_test_1.test)('Null and undefined handling', () => {
        const objWithNulls1 = { a: null, b: { c: undefined } };
        const objWithNulls2 = { a: 'not null', b: { c: 'defined', d: null } };
        const result = (0, main_js_1.deepMixin)(objWithNulls1, objWithNulls2);
        assert.strictEqual(result.a, 'not null', 'Should override null with non-null value');
        assert.strictEqual(result.b.c, 'defined', 'Should override undefined with defined value');
        assert.strictEqual(result.b.d, null, 'Should preserve null values');
    });
    (0, node_test_1.test)('Primitive type preservation', () => {
        const primitives1 = {
            str: 'string1',
            num: 42,
            bool: true,
            big: BigInt(123),
            sym: Symbol('test')
        };
        const primitives2 = {
            str: 'string2',
            num: 84,
            bool: false,
            big: BigInt(456),
            sym: Symbol('test2')
        };
        const result = (0, main_js_1.deepMixin)(primitives1, primitives2);
        assert.strictEqual(result.str, 'string2', 'Should use later string');
        assert.strictEqual(result.num, 84, 'Should use later number');
        assert.strictEqual(result.bool, false, 'Should use later boolean');
        assert.strictEqual(result.big, BigInt(456), 'Should use later BigInt');
        assert(result.sym === primitives2.sym, 'Should use later Symbol');
    });
    (0, node_test_1.test)('deepMixinRightNoFunctions keeps left precedence and removes functions', () => {
        const result = (0, main_js_1.deepMixinRightNoFunctions)({ value: 'left', nested: { left: true }, fn: () => 'left' }, { value: 'right', nested: { right: true }, fn: () => 'right' });
        assert.strictEqual(result.value, 'left', 'Should preserve left precedence');
        assert.deepStrictEqual(result.nested, { left: true, right: true });
        assert.strictEqual(result.fn, undefined, 'Should remove functions from both sides');
    });
    (0, node_test_1.test)('deepMixinClean keeps safe built-ins and excludes executable collections', () => {
        const createdAt = new Date('2026-08-25T00:00:00Z');
        const pattern = /safe/gi;
        const bytes = new Uint8Array([1, 2, 3]);
        const result = (0, main_js_1.deepMixinClean)({
            createdAt,
            pattern,
            bytes,
            map: new Map([['secret', 'value']]),
            set: new Set(['secret']),
            fn: () => 'secret'
        });
        assert(result.createdAt instanceof Date);
        assert.notStrictEqual(result.createdAt, createdAt);
        assert.strictEqual(result.createdAt.getTime(), createdAt.getTime());
        assert(result.pattern instanceof RegExp);
        assert.strictEqual(result.pattern.source, pattern.source);
        assert(result.bytes instanceof Uint8Array);
        assert.deepStrictEqual(Array.from(result.bytes), [1, 2, 3]);
        assert.strictEqual(result.map, undefined);
        assert.strictEqual(result.set, undefined);
        assert.strictEqual(result.fn, undefined);
    });
    (0, node_test_1.test)('deepMixinClean returns plain objects without inherited properties', () => {
        class WithPrototype {
            inherited() {
                return 'not copied';
            }
        }
        const value = Object.assign(new WithPrototype(), { own: { safe: true } });
        const result = (0, main_js_1.deepMixinClean)(value);
        assert.deepStrictEqual(result, { own: { safe: true } });
        assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
        assert.strictEqual(result.inherited, undefined);
    });
    (0, node_test_1.test)('deepMixinClean preserves circular identity without retaining the source', () => {
        const source = { name: 'root' };
        source.self = source;
        const result = (0, main_js_1.deepMixinClean)(source);
        assert.notStrictEqual(result, source);
        assert.strictEqual(result.name, 'root');
        assert.strictEqual(result.self, result);
    });
});
