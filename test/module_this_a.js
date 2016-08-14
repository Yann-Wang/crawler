/**
 * Created by spray on 16-8-3.
 */
const dd = require('./module_this_b');
var obj = {name: 'xx'};
//dd.apply(obj);
dd();  // 此时打印的是全局对象global