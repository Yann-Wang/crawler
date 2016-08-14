/**
 * Created by spray on 16-8-5.
 */
const async = require('async');
const db    = require('../config').db;
const dataDir = require('../config').dataDir;
const debug = require('debug')('blog:update:save');
const fs    = require('fs-extra');
const preprocess = require('./lib/preprocess');
const moment = require('moment');

/**
 * 保存文章分类
 *
 * @param {Object} list
 * @param {Function} callback
 */
exports.classList = function (list, callback) {
    debug('保存文章分类列表到数据库中：%d', list.length);

    async.eachSeries(list, function (item, next) {
        //查询分类是否存在
        db.query('select * from `class_list` where `id`=? limit 1',[item.id], function (err, data) {
            if (err) return next(err);

            if (Array.isArray(data) && data.length >= 1){
                //分类已存在,　更新一下
                db.query('update `class_list` set `name`=?,`url`=? where `id`=?',[item.name, item.url, item.id], next);

            } else {
                //分类不存在, 添加
                db.query('insert into `class_list`(`id`,`name`,`url`) values(?,?,?)',[item.id, item.name, item.url], next);
            }
        });
    }, callback);
};

/**
 * 保存文章列表
 *
 * @param {Number} class_id
 * @param {Array} list
 * @param {Function} callback
 */
exports.articleList = function (class_id, list, callback) {
    debug('保存文章列表到数据库中：%d, %d', class_id, list.length);

    async.eachSeries(list, function (item, next) {
        //查询文章是否已存在
        db.query('select * from `article_list` where `id`=? and `class_id`=? limit 1', [item.id, class_id], function (err, data) {
            if (err) return next(err);

            //将发布时间转成时间戳（秒）
            var created_time = new Date(item.time).getTime() / 1000;;

            if (Array.isArray(data) && data.length >=1){
                //分类已存在，　更新一下
                db.query('update `article_list` set `title`=?, `url`=?, `class_id`=?, `created_time`=? where `id`=? and `class_id`=?', [item.title, item.url, class_id, created_time,item.id,class_id],next);
            } else {
                //分类不存在，添加
                db.query('insert into `article_list`(`id`, `title`, `url`, `class_id`, `created_time`) values(?,?,?,?,?)', [item.id, item.title, item.url, class_id, created_time], next);
            }
        });
    }, callback);
};

/**
 * 保存文章分类的文章数量
 *
 * @param {Number} class_id
 * @param {Number} count
 * @param {Function} callback
 */
exports.articleCount = function (class_id, count, callback) {
    debug('保存文章分类的文章数量：%d,%d', class_id, count);

    db.query('update `class_list` set `count`=? where `id`=?', [count, class_id], callback);
};

/**
 * 保存文章标签
 *
 * @param {String} id
 * @param {Array} tags
 * @param {Function} callback
 */
exports.articleTags = function (id, tags, callback) {
    debug('保存文章标签：%s,%s', id, tags);

    //删除旧的标签信息
    db.query('delete from `article_tag` where `id`=?',[id], function (err) {
        if (err) return callback(err);

        if(tags.length > 0){
            //添加新标签信息
            //生成SQL代码
            var values = tags.map(function (tag){
                return '(' + db.escape(id) + ', ' + db.escape(tag) + ')';
            }).join(', ');

            db.query('insert into `article_tag`(`id`, `tag`) values ' + values, callback);
        } else {
            //如果没有标签，直接返回
            callback(null);
        }
    });
};

/**
 * 保存文章内容
 *
 * @param {String} id
 * @param {Array} tags
 * @param {String} content
 * @param {String} time
 * @param {Function} callback
 */
exports.articleDetail = function (id, tags, content, time, callback) {
    debug('保存文章内容：%s', id);

    //var year = new Date(time).getFullYear();
    var year = moment(time).toObject().years;

    //检查文章是否存在
    db.query('select `id` from `article_detail` where `id`=?', [id], function (err, data) {
        if (err) return callback(err);

        var tagsOriginal = tags;
        tags = tags.join(' ');
        var path = '' + year + '/';
        var file = dataDir + path + id + '.html';
        var html = preprocess.wrap(content);

        function cb() {
            fs.outputFile(file, html, function (err) {
                if (err) return callback(err);

                callback(null, tagsOriginal);
            });
        }

                                                                                                                                                                                                        if (Array.isArray(data) && data.length >= 1) {
            //更新文章
            db.query('update `article_detail` set  `tag`=?, `path`=? where `id`=?', [tags, path, id], cb);
        } else {
            //添加文章
            db.query('insert into `article_detail`(`id`, `tags`, `path`) values(?,?,?)',[id,tags, path], cb);
        }
    });
};

/**
 * 检查文章是否存在
 *
 * @param {String} id
 * @param {Function} callback
 */
exports.isArticleExists = function (id, callback) {
    db.query('select `id` from `article_detail` where `id`=?',[id], function (err, data) {
        if (err) return callback(err);

        callback(null, Array.isArray(data) && data.length >= 1);
    });
};
