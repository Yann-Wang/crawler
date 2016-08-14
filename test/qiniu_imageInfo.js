/**
 * Created by spray on 16-8-10.
 */
const qiniu   = require('node-qiniu');

qiniu.config({
    access_key: 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ',
    secret_key: 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN'
});

var imagesBucket = qiniu.bucket('crawler-image');

var key = '001Wf5K2gy6DDPZGOQTf7';
/*
var image = imagesBucket.image(key);

image.imageInfo(function(err, info) {
    if (err) {
        return console.error(err);
    }

    console.dir(info);
});
*/




/*
imagesBucket.key(key).remove(function(err) {
    if (err) {
        return console.error(err);
    }
});
*/


var picture = imagesBucket.key(key);
picture.stat(function(err, stat) {
    if (err) {
        return console.error(err);
    }

    console.dir(stat);
});

