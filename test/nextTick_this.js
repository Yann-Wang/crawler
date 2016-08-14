/**
 * Created by spray on 16-8-4.
 */

if (!Function.prototype.softBind){
    Function.prototype.softBind = function(obj) {
        var fn = this;
        //捕获所有curried参数
        var curried = [].slice.call(arguments, 1);
        var bound   = function() {
            console.log(this == global);
            return fn.apply(
                (!this || this === global) ? obj : this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    };
}

function foo() {
    console.log(this);
}

var obj  = { name: "obj" };

var fn = foo.softBind(obj);

process.nextTick(fn);