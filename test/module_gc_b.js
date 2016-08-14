/**
 * Created by spray on 16-8-12.
 */
let module_gc_a = require('./module_gc_a');

function read() {
    module_gc_a.test();
}

for (var i=0;i<10;i++){
    read();
}


