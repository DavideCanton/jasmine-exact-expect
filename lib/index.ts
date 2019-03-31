import * as _ from 'lodash';

declare let self: any;
declare let window: any;

function getGlobal()
{
    return (function(global: any)
    {
        return global;
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
}

(function(globalObj)
{
    if(!_.isFunction(globalObj.beforeEach) || !_.isFunction(globalObj.afterEach) || !_.isFunction(globalObj.expect) || !_.isFunction(globalObj.expectAsync))
        throw new Error('jasmine globals not found.');
})(getGlobal());

let expectedExpects: number | null = null;
let expectedAsyncExpects: number | null = null;
let expectSpy: jasmine.Spy;
let expectAsyncSpy: jasmine.Spy;

export function expectCount(num: string | number)
{
    num = parseNumber(num);
    expectedExpects = num;
}

export function expectAsyncCount(num: string | number)
{
    num = parseNumber(num);
    expectedAsyncExpects = num;
}

function parseNumber(num: string | number)
{
    num = _.isString(num) ? parseInt(num, 10) : num;
    if(isNaN(num) || num < 0)
        throw new Error('expects a number >= 0 as the first argument.');
    return num;
}

function throwError(expected: number | null, actual: number)
{
    if(expected !== null && actual !== expected)
        throw new Error(`Expected ${expected} expect${expected !== 1 ? 's' : ''} to be called, ${actual} expect${actual !== 1 ? 's were' : ' was'} actually called.`);
}

(function(globalObj)
{
    beforeEach(function()
    {
        expectedExpects = null;
        expectedAsyncExpects = null;
        expectSpy = spyOn(globalObj as any, 'expect').and.callThrough();
        expectAsyncSpy = spyOn(globalObj as any, 'expectAsync').and.callThrough();
    });

    afterEach(function()
    {
        throwError(expectedExpects, expectSpy.calls.count());
        throwError(expectedAsyncExpects, expectAsyncSpy.calls.count());
    });
})(getGlobal());
