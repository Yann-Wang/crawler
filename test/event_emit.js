/**
 * Created by spray on 16-8-4.
 */
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
    EventEmitter.call(this);
    this.emit('event');
}
util.inherits(MyEmitter, EventEmitter); //继承原型方法

const myEmitter = new MyEmitter();  //this绑定指向新产生的MyEmitter函数对象
myEmitter.on('event', function() {
    console.log('an event occurred!');
});