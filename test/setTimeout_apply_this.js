/**
 * Created by spray on 16-8-4.
 */
function foo() {
    //console.log(this == global);
    console.log(this);
}

var obj = {
    a: 2,
    foo: foo
};

function foo2() {
    foo.apply(obj)
}

setTimeout(foo2,10);