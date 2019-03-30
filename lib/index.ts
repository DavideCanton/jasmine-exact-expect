import * as _ from 'lodash';

if(!_.isFunction(beforeEach) || !_.isFunction(afterEach) || !_.isFunction(expect))
    throw new Error('jasmine globals not found.');

let expectedExpects = null;
let spy: jasmine.Spy;

export function expectCount(num: string | number)
{
    num = _.isString(num) ? parseInt(num, 10) : num;

    if(isNaN(num) || num < 0)
        throw new Error('jasmine.expectCount expects a number >= 0 as the first argument.');

    expectedExpects = num;
}

function throwError(expected: number, actual: number)
{
    if(expected !== null && actual !== expected)
        throw new Error(`Expected ${expected} expect${expected !== 1 ? 's' : ''} to be called, ${actual} expect${actual !== 1 ? 's were' : ' was'} actually called.`);
}

beforeEach(function()
{
    expectedExpects = null;
    spy = spyOn(global as any, 'expect').and.callThrough();
});

afterEach(function()
{
    throwError(expectedExpects, spy.calls.count());
});
