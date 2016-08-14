/**
 * Created by spray on 16-8-3.
 */
if (!Function.prototype.softBind){
    Function.prototype.softBind = function(obj) {
        var fn = this;
        //捕获所有curried参数
        var curried = [].slice.call(arguments, 1);
        var bound   = function() {
            console.log(this);
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
    console.log("name: " + this.name);
}

var obj  = { name: "obj" },
    obj2 = { name: "boj2" },
    obj3 = { name: "obj3" };

//var fooOBJ = foo.softBind(obj);
//fooOBJ(); // name: obj   // 软绑定

obj2.foo = foo.softBind(obj);
//obj2.foo(); // name: obj2     // 隐式绑定

//fooOBJ.call(obj3); // name: obj3   // 显式绑定

setTimeout(obj2.foo, 10); // name: obj  // 软绑定
//javascript函数参数只能按值传递， 传参赋值造成了间接引用， 从而造成了隐式丢失，所以只剩下了软绑定