/**
 * Created by spray on 16-8-5.
 */
const originRequest = require('./lib/request').request;
const cheerio = require('cheerio');
var   debug   = require('debug')('blog:update:read');
const async   = require('async');
const db      = require('../config').db;

/**
 * 请求指定url
 *
 * @param url
 * @param callback
 */
function request(url, callback) {
    originRequest(url, callback);
}

/**
 * 获取文章分类列表
 *
 * @param url
 * @param callback
 */
exports.classList = function (url, callback) {
    debug('读取文章分类列表：%s', url);

    //读取博客首页
    request(url, function (err, res) {
        if (err) return callback(err);

        //根据网页内容创建DOM操作对象
        var $ = cheerio.load(res.body.toString());

        //读取博文类别列表
        var  classList = [];
        $('.classList li a').each(function () {
            var $me = $(this);
            var item = {
                name: $me.text().trim(),
                url:  $me.attr('href')
            };
            //从URL中取出分类的ID
            var s = item.url.match(/articlelist_\d+_(\d+)_\d\.html/);
            if (Array.isArray(s)){
                item.id = s[1];
                classList.push(item);
            }
        });

        //输出结果
        callback(null,classList);
    });
};

/**
 * 获取分类页面博文列表
 *
 * @param url
 * @param callback
 */
exports.articleList = function (url, callback) {
    debug('读取博文列表：%s', url);

    //读取博文列表
    request(url, function (err, res) {
        if (err) return callback(err);

        //根据网页内容创建DOM操作对象
        var $ = cheerio.load(res.body.toString());

        //读取博文类别列表
        var articleList = [];
        $('.articleList .articleCell').each(function () {
            var $me = $(this);
            var $title = $me.find('.atc_title a');
            var $time = $me.find('.atc_tm');
            var item = {
                title: $title.text().trim(),
                url: $title.attr('href'),
                time: $time.text().trim()
            };
            //从URL中取出分类的ID
            var s = item.url.match(/blog_(\w+)\.html/);
            if (Array.isArray(s)) {
                item.id = s[1];
                articleList.push(item);
            }
        });

        //检查是否有下一页
        var nextUrl = $('.SG_pgnext a').attr('href');
        if (nextUrl){
            //读取下一页
            exports.articleList(nextUrl, function (err, articleList2) {
                if (err) return callback(err);

                //合并结果
                callback(null, articleList.concat(articleList2));
            });
        }else{
            //返回结果
            callback(null, articleList);
        }
    });
};

/**
 * 获取博文页面内容
 *
 * @param url
 * @param callback
 */
exports.articleDetail = function (id, url, callback) {
    debug('获取博文内容：%s', url);

    async.waterfall([
        function (cb) {
            db.query('select `id` from `article_tag` where `id`=?',[id], function (err, data) {
                if (Array.isArray(data) && data.length >= 1) {
                    debug('该博文已存在：%s', url);
                    cb("file existed");
                }else{
                    cb(null);
                }
            });
        },
        function (cb) {
            //读取博文页面
            request(url, function (err, res) {
                if (err) return cb(err);

                //根据网页内容创建DOM操作对象
                var $ = cheerio.load(res.body.toString());

                //获取文章标签
                var tags = [];
                $('.blog_tag h3 a').each(function () {
                    var tag = $(this).text().trim();
                    if (tag) {
                        tags.push(tag);
                    }
                });

                //获取文章内容
                var content = $.html('.articalContent').trim();

                //输出结果
                cb(null, {tags: tags, content: content});
            });
        }
    ], function (err, result) {
        if (err == "file existed") return callback("file existed");
        if (err) return callback(err);

        callback(null,result);
    });
};



