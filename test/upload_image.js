/**
 * Created by spray on 16-8-9.
 */
const request = require('request');
const qiniu   = require('node-qiniu');

qiniu.config({
    access_key: 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ',
    secret_key: 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN'
});



var imagesBucket = qiniu.bucket('crawler-image');

var puttingStream = imagesBucket.createPutStream('exampleKey_3');

request('http://s13.sinaimg.cn/mw690/001Wf5K2gy6Jcoqdmva9c&690').pipe(puttingStream)
.on('error', function(err) {
    console.error(err);
})
.on('end', function(reply) {
    console.dir(reply);
});