/**
 * Created by spray on 16-8-4.
 */
function foo() {
    console.log(this);
}

var obj  = { name: "obj" };

function foo2() {
    foo.apply(obj);
}

setImmediate(foo2);

/*
Timeout {
    _called: true,
        _idleTimeout: 10,
        _idlePrev: null,
        _idleNext: null,
        _idleStart: 84,
        _onTimeout: [Function],
        _repeat: null }

Immediate {
    _idleNext: null,
        _idlePrev: null,
        _callback: [Function],
        _argv: undefined,
        _onImmediate: [Function],
        domain: null }

*/