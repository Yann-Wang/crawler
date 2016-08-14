/**
 * Created by spray on 16-8-9.
 */

const async   = require('async');
const request = require('request');
const qiniu = require("node-qiniu");
const debug   = require('debug')('blog:update:qiniu_upload');

qiniu.config({
    access_key: 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ',
    secret_key: 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN'
});

// qiniu.conf.ACCESS_KEY = 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ';
// qiniu.conf.SECRET_KEY = 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN';

//构建bucketmanager对象
//var client = new qiniu.rs.Client();

//你要测试的空间， 并且这个key在你空间中存在
var bucket = 'crawler-image';
var imagesBucket = qiniu.bucket(bucket);

exports.upload = function (imgUrl, key, callback) {

    var puttingStream = imagesBucket.createPutStream(key);
    //let count =0;

    // function iterator() {
    //     count++;
    //     if(count <=1){
            request.get(imgUrl)
                .on('error', function (err) {
                    if (err) {
                        console.log('get', err);
                    }
                })
                .pipe(puttingStream)
                .on('error', function (err) {
                    if (err) {
                        console.log('pipe', err);
                    }
                })
                .on('end', function (reply) {
                    console.log('end', reply);
                    callback(null);
                });
        // }else{
        //     callback(null);
        // }

    // }
    //
    // try {
    //     iterator();
    // }
    // catch(e){
    //     console.log('catch',e);
    //
    //     setTimeout(function () {
    //         iterator();
    //     }, 5000);
    // }






};