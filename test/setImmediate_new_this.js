/**
 * Created by spray on 16-8-4.
 */
function foo() {
    return function () {
        console.log(this);
    };
}
var newFoo = new foo();
console.log(newFoo);

//setImmediate(newFoo);

/*
function foo3(fn) {
    fn();
}

foo3();
*/