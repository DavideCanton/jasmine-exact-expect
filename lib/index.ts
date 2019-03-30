import * as _ from 'lodash';

function setupExpectedCount(global)
{
    if(!global.jasmine)
        throw new Error('jasmine must be loaded before jasmine2-focused');

    let expectedExpects = null;
    let spy;

    global.jasmine.expectCount = function(num: string | number)
    {
        num = _.isString(num) ? parseInt(num, 10) : num;

        if(isNaN(num) || num < 0)
            throw new Error('jasmine.expectCount expects a number >= 0 as the first argument.');

        expectedExpects = num;
    };

    global.beforeEach(function()
    {
        expectedExpects = null;

        spy = global.spyOn(global, 'expect').and.callThrough();
    });

    global.afterEach(function()
    {
        throwError(expectedExpects, spy.calls.count());
    });
}

function throwError(expectedExpects: number, numExpects: number)
{
    if(expectedExpects !== null && numExpects !== expectedExpects)
        throw new Error(`Expected ${expectedExpects} expect${expectedExpects !== 1 ? 's' : ''} to be called, ${numExpects} expect${numExpects !== 1 ? 's were' : ' was'} actually called.`);
}

// tslint:disable-next-line:prefer-const
let self: any;
// tslint:disable-next-line:prefer-const
let window: any;

export function initExpectCount()
{
    const globalObj = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {};
    setupExpectedCount(globalObj);
}
