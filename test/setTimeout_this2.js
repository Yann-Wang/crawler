/**
 * Created by spray on 16-8-3.
 */
function foo() {
    //console.log(this == global);
    console.log(this);
}

var obj = {
    a: 2,
    foo: foo
};

//process.nextTick(obj.foo);

setImmediate(obj.foo);

//setTimeout(obj.foo, 10);