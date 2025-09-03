#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_test_1 = require("node:test");
var assert = require('node:assert');
var main_js_1 = require("../../dist/main.js");
(0, node_test_1.describe)('Enhanced Deep Mixin Functionality', function () {
    (0, node_test_1.test)('Basic deep mixin functionality', function () {
        var obj1 = { a: 1, b: { c: 2 } };
        var obj2 = { b: { d: 3 }, e: 4 };
        var result = (0, main_js_1.deepMixin)(obj1, obj2);
        assert.strictEqual(result.a, 1, 'Should preserve obj1.a');
        assert.strictEqual(result.b.c, 2, 'Should preserve obj1.b.c');
        assert.strictEqual(result.b.d, 3, 'Should add obj2.b.d');
        assert.strictEqual(result.e, 4, 'Should add obj2.e');
    });
    (0, node_test_1.test)('Date object handling', function () {
        var date1 = new Date('2023-01-01');
        var date2 = new Date('2023-12-31');
        var objWithDate1 = { timestamp: date1, name: 'test1' };
        var objWithDate2 = { timestamp: date2, name: 'test2' };
        var result = (0, main_js_1.deepMixin)(objWithDate1, objWithDate2);
        assert(result.timestamp instanceof Date, 'Should preserve Date type');
        assert.strictEqual(result.timestamp.getTime(), date2.getTime(), 'Should use the later date');
        assert.strictEqual(result.name, 'test2', 'Should use the later name');
    });
    (0, node_test_1.test)('RegExp object handling', function () {
        var regex1 = /hello/gi;
        var regex2 = /world/g;
        var objWithRegex1 = { pattern: regex1, flag: 'test1' };
        var objWithRegex2 = { pattern: regex2, flag: 'test2' };
        var result = (0, main_js_1.deepMixin)(objWithRegex1, objWithRegex2);
        assert(result.pattern instanceof RegExp, 'Should preserve RegExp type');
        assert.strictEqual(result.pattern.source, 'world', 'Should use the later regex source');
        assert.strictEqual(result.pattern.flags, 'g', 'Should use the later regex flags');
        assert.strictEqual(result.flag, 'test2', 'Should use the later flag');
    });
    (0, node_test_1.test)('Map object handling', function () {
        var map1 = new Map([['key1', 'value1'], ['key2', 'value2']]);
        var map2 = new Map([['key2', 'updated_value2'], ['key3', 'value3']]);
        var objWithMap1 = { data: map1, id: 1 };
        var objWithMap2 = { data: map2, id: 2 };
        var result = (0, main_js_1.deepMixin)(objWithMap1, objWithMap2);
        assert(result.data instanceof Map, 'Should preserve Map type');
        assert.strictEqual(result.data.get('key1'), 'value1', 'Should preserve key1 from map1');
        assert.strictEqual(result.data.get('key2'), 'value2', 'Should preserve key2 from map1 (first argument takes precedence)');
        assert.strictEqual(result.data.get('key3'), 'value3', 'Should add key3 from map2');
        assert.strictEqual(result.id, 2, 'Should use the later id');
    });
    (0, node_test_1.test)('Set object handling', function () {
        var set1 = new Set(['a', 'b', 'c']);
        var set2 = new Set(['c', 'd', 'e']);
        var objWithSet1 = { items: set1, count: 3 };
        var objWithSet2 = { items: set2, count: 3 };
        var result = (0, main_js_1.deepMixin)(objWithSet1, objWithSet2);
        assert(result.items instanceof Set, 'Should preserve Set type');
        assert(result.items.has('a'), 'Should preserve a from set1');
        assert(result.items.has('b'), 'Should preserve b from set1');
        assert(result.items.has('c'), 'Should preserve c from both sets');
        assert(result.items.has('d'), 'Should add d from set2');
        assert(result.items.has('e'), 'Should add e from set2');
        assert.strictEqual(result.count, 3, 'Should use the later count');
    });
    (0, node_test_1.test)('ArrayBuffer and TypedArray handling', function () {
        var buffer1 = new ArrayBuffer(8);
        var buffer2 = new ArrayBuffer(16);
        var view1 = new Uint8Array(buffer1);
        var view2 = new Uint16Array(buffer2);
        view1[0] = 42;
        view2[0] = 1000;
        var objWithBuffer1 = { buffer: buffer1, view: view1, type: 'uint8' };
        var objWithBuffer2 = { buffer: buffer2, view: view2, type: 'uint16' };
        var result = (0, main_js_1.deepMixin)(objWithBuffer1, objWithBuffer2);
        assert(result.buffer instanceof ArrayBuffer, 'Should preserve ArrayBuffer type');
        assert(result.view instanceof Uint16Array, 'Should preserve TypedArray type');
        assert.strictEqual(result.view[0], 1000, 'Should use the later view data');
        assert.strictEqual(result.type, 'uint16', 'Should use the later type');
    });
    (0, node_test_1.test)('Circular reference handling', function () {
        var circular1 = { name: 'obj1' };
        var circular2 = { name: 'obj2' };
        circular1.ref = circular1; // Create circular reference
        circular2.ref = circular2; // Create circular reference
        var result = (0, main_js_1.deepMixin)(circular1, circular2);
        assert.strictEqual(result.name, 'obj2', 'Should use the later name');
        assert.strictEqual(result.ref, result, 'Should handle circular reference correctly');
    });
    (0, node_test_1.test)('Function property handling', function () {
        var func1 = function () { return 'func1'; };
        var func2 = function () { return 'func2'; };
        func1.customProp = 'prop1';
        func2.customProp = 'prop2';
        var objWithFunc1 = { fn: func1, id: 1 };
        var objWithFunc2 = { fn: func2, id: 2 };
        var result = (0, main_js_1.deepMixin)(objWithFunc1, objWithFunc2);
        assert(typeof result.fn === 'function', 'Should preserve function type');
        assert.strictEqual(result.fn(), 'func2', 'Should use the later function');
        assert.strictEqual(result.fn.customProp, 'prop2', 'Should preserve function properties');
        assert.strictEqual(result.id, 2, 'Should use the later id');
    });
    (0, node_test_1.test)('deepMixinNoFunctions functionality', function () {
        var objWithFunc3 = {
            data: { value: 1 },
            fn: function () { return 'should be excluded'; },
            regular: 'keep this'
        };
        var objWithFunc4 = {
            data: { value: 2 },
            fn: function () { return 'should also be excluded'; },
            regular: 'keep this too'
        };
        var result = (0, main_js_1.deepMixinNoFunctions)(objWithFunc3, objWithFunc4);
        assert.strictEqual(result.data.value, 2, 'Should mix non-function properties');
        assert.strictEqual(result.regular, 'keep this too', 'Should use the later regular property');
        // deepMixinNoFunctions should exclude functions, so fn should not exist
        assert.strictEqual(result.fn, undefined, 'Should exclude functions');
    });
    (0, node_test_1.test)('deepMixinRight functionality', function () {
        var leftObj = { a: 1, b: { c: 2 } };
        var rightObj = { b: { d: 3 }, e: 4 };
        var result = (0, main_js_1.deepMixinRight)(leftObj, rightObj);
        assert.strictEqual(result.a, 1, 'Should preserve leftObj.a');
        assert.strictEqual(result.b.c, 2, 'Should preserve leftObj.b.c');
        assert.strictEqual(result.b.d, 3, 'Should add rightObj.b.d');
        assert.strictEqual(result.e, 4, 'Should add rightObj.e');
    });
    (0, node_test_1.test)('Complex nested object with multiple built-in types', function () {
        var complex1 = {
            metadata: {
                created: new Date('2023-01-01'),
                tags: new Set(['tag1', 'tag2']),
                config: new Map([['setting1', 'value1']]),
                pattern: /test/gi
            },
            data: new Uint8Array([1, 2, 3]),
            name: 'complex1'
        };
        var complex2 = {
            metadata: {
                created: new Date('2023-12-31'),
                tags: new Set(['tag2', 'tag3']),
                config: new Map([['setting2', 'value2']]),
                pattern: /updated/g
            },
            data: new Uint8Array([4, 5, 6]),
            name: 'complex2'
        };
        var result = (0, main_js_1.deepMixin)(complex1, complex2);
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
    (0, node_test_1.test)('Custom properties on built-in objects', function () {
        var mapWithProps = new Map([['key', 'value']]);
        mapWithProps.customProp = 'customValue';
        mapWithProps.customMethod = function () { return 'customMethod'; };
        var setWithProps = new Set(['item1']);
        setWithProps.customProp = 'setCustomValue';
        var objWithCustomProps1 = { map: mapWithProps, set: setWithProps };
        var objWithCustomProps2 = { map: new Map([['newKey', 'newValue']]), set: new Set(['newItem']) };
        var result = (0, main_js_1.deepMixin)(objWithCustomProps1, objWithCustomProps2);
        assert(result.map instanceof Map, 'Should preserve Map type');
        assert(result.set instanceof Set, 'Should preserve Set type');
        assert.strictEqual(result.map.customProp, 'customValue', 'Should preserve custom properties on Map');
        assert(typeof result.map.customMethod === 'function', 'Should preserve custom methods on Map');
        assert.strictEqual(result.set.customProp, 'setCustomValue', 'Should preserve custom properties on Set');
    });
    (0, node_test_1.test)('Symbol properties handling', function () {
        var _a, _b;
        var sym1 = Symbol('test1');
        var sym2 = Symbol('test2');
        var objWithSymbols1 = (_a = {}, _a[sym1] = 'value1', _a.regular = 'prop1', _a);
        var objWithSymbols2 = (_b = {}, _b[sym2] = 'value2', _b.regular = 'prop2', _b);
        var result = (0, main_js_1.deepMixin)(objWithSymbols1, objWithSymbols2);
        assert.strictEqual(result[sym1], 'value1', 'Should preserve symbol property from obj1');
        assert.strictEqual(result[sym2], 'value2', 'Should add symbol property from obj2');
        assert.strictEqual(result.regular, 'prop2', 'Should use the later regular property');
    });
    (0, node_test_1.test)('Null and undefined handling', function () {
        var objWithNulls1 = { a: null, b: { c: undefined } };
        var objWithNulls2 = { a: 'not null', b: { c: 'defined', d: null } };
        var result = (0, main_js_1.deepMixin)(objWithNulls1, objWithNulls2);
        assert.strictEqual(result.a, 'not null', 'Should override null with non-null value');
        assert.strictEqual(result.b.c, 'defined', 'Should override undefined with defined value');
        assert.strictEqual(result.b.d, null, 'Should preserve null values');
    });
    (0, node_test_1.test)('Primitive type preservation', function () {
        var primitives1 = {
            str: 'string1',
            num: 42,
            bool: true,
            big: BigInt(123),
            sym: Symbol('test')
        };
        var primitives2 = {
            str: 'string2',
            num: 84,
            bool: false,
            big: BigInt(456),
            sym: Symbol('test2')
        };
        var result = (0, main_js_1.deepMixin)(primitives1, primitives2);
        assert.strictEqual(result.str, 'string2', 'Should use later string');
        assert.strictEqual(result.num, 84, 'Should use later number');
        assert.strictEqual(result.bool, false, 'Should use later boolean');
        assert.strictEqual(result.big, BigInt(456), 'Should use later BigInt');
        // Symbols are compared by reference, so we can't use strictEqual
        // Instead, we check that the symbol exists and is from the second object
        assert(result.sym === primitives2.sym, 'Should use later Symbol');
    });
});
