/**
 * Created by spray on 16-8-5.
 */
const async  = require('async');
const config = require('../config');
const read   = require('./read');
const save   = require('./save');
const saveImg= require('./saveImg').saveImg;
const debug  = require('debug')('blog:update:all');
const fs     = require('fs-extra');

var classList;
var articleList = {};

async.series([
    //获取文章分类列表
    function (done) {
        read.classList(config.sinaBlog.url, function (err, list) {
            classList = list;
            done(err);
        });
    },
    //保存文章分类
    function (done) {
        save.classList(classList, done);
    },
    //依次获取所有文章分类下的文章列表
    function (done) {
        async.eachSeries(classList, function (c, next) {
            let count = 0;
            function iteratee() {
                read.articleList(c.url, function (err, list) {
                    if (err) {
                        count++;
                        if(count <=1){
                            setTimeout(function () {
                                iteratee();
                            }, 5000);
                        } else{
                            next(err);
                        }
                    }else{
                        articleList[c.id] = list;
                        next();
                    }

                });
            }
            iteratee();

        }, done);
    },
    //保存文章列表
    function (done) {
        async.eachSeries(Object.keys(articleList), function (classId, next) {
            save.articleList(classId, articleList[classId], next);
        }, done);
    },
    //保存文章数量
    function (done) {
        async.eachSeries(Object.keys(articleList), function (classId, next) {
            save.articleCount(classId, articleList[classId].length, next);
        }, done);
    },
    //重新整理文章列表，把重复的文章去掉
    function (done) {
        debug('整理文章列表，把重复的文章去掉');

        var articles = {};
        Object.keys(articleList).forEach(function (classId) {
            articleList[classId].forEach(function (item) {
                articles[item.id] = item;  //把文章列表扁平化
            });
        });

        articleList = [];　//格式化文章列表

        Object.keys(articles).forEach(function (id) {
            articleList.push(articles[id]);
        });

        done();
    },
    //依次读取文章的详细内容，并保存
    function (done) {
       async.eachSeries(articleList, function (item, next) {
           //虽然前面已经把文章列表去重了，但是这里在插入数据库表前，依然要查询判断是否已经插入，
           //防止出错！
           //插入相同的记录是会报错的！！！


           async.waterfall([
               function (callback) {
                   save.isArticleExists(item.id, function (err, exists) {
                       if(err) return callback(err);

                       if (exists) {
                           debug('文章已存在：%s', item.url);
                           return callback();
                       }

                       callback(null);
                   });
               },
               function (callback) {
                   read.articleDetail(item.id, item.url, function (err, ret) {
                       if (err == "file existed") return callback("file existed");
                       if (err) return callback(err);

                       callback(null, ret);
                   });
               },
               function (arg1, callback) {
                   saveImg(arg1.tags, arg1.content,function (err, ret) {
                       if (err) return callback(err);

                       callback(null, ret);
                   })
               },
               function (arg1, callback) {
                   save.articleDetail(item.id, arg1.tags, arg1.content, item.time, function (err, tags) {
                       if(err) return callback(err);

                       callback(null, tags);
                   });
               },
               function (arg1, callback) {
                   save.articleTags(item.id, arg1, function (err) {
                       if(err) return callback(err);

                       callback(null);
                   });
               }

           ],function (err) {
               if (err == "file existed") return next();
               if (err) return next(err);

               next();
           });


       },done);
    }
], function (err) {
    if (err) console.error(err.stack);

    console.log('完成');
    process.exit(0);
});

process.on('uncaughtException', function (err) {
    var file = '/home/spray/crawler/crawler.log';
    fs.outputFile(file, err, function (err) {
        console.log(err);
    });

});