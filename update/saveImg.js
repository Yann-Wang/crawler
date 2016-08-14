/**
 * Created by spray on 16-8-8.
 */
const cheerio = require('cheerio');
const async   = require('async');
const debug   = require('debug')('blog:update:saveImg');
const storeDir= require('../config').storeDir;
const qiniuUpload = require('./lib/qiniu_upload');

exports.saveImg = function (tags, cnt, callback) {
    //根据网页内容创建DOM操作对象
    var $ = cheerio.load(cnt);
    var imgList = $('.articalContent img');

    debug('保存文章中的图片到云存储：%d', imgList.length);

    async.eachSeries(imgList, function (img, next) {
        var b = img.attribs.real_src.match(/http\:\/\/s\d{1,2}\.sinaimg\.cn\/(middle|mw690)\/(\w+)&690/);
        if (b){
            img.attribs.src = 'http://' + storeDir + b[2] + '&690';
            qiniuUpload.upload(b[0], b[2], function (err) {
                if (err) return next(err);
                //delay 0~3 seconds
                var random = Math.floor(Math.random()*3000);
                setTimeout(function () {
                    next();
                }, random);

            });
        }else{
            next();
        }
    }, function (err) {
        if (err) return callback(err);

        //获取文章内容
        var content = $.html('.articalContent').trim();

        //输出结果
        callback(null, {tags: tags, content: content});
    });


};

