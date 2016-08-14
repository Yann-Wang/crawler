/**
 * Created by spray on 16-8-5.
 */
const async = require('async');
const db    = require('../config').db;
const debug = require('debug')('blog:web:read');

/**
 * 获取文章分类列表
 *
 * @param {Function} callback
 */
exports.classList = function (callback) {
    debug('获取文章分类列表');

    db.query('select * from `class_list` order by `id` asc', callback);
};

/**
 * 检查分类是否存在
 *
 * @param {Number} id
 * @param {Function} callback
 */
exports.isClassExists = function (id, callback) {
    debug('检查分类是否存在：%s', id);

    db.query('select * from `class_list` where `id`=? limit 1',[id], function (err, ret) {
        if (err) return next(err);

        callback(null, Array.isArray(ret) && ret.length > 0);
    });
};

/**
 * 获取指定分类的信息
 *
 * @param {Number} id
 * @param {Function} callback
 */
exports.class = function (id, callback) {
    debug('获取指定分类的信息：%s', id);

    db.query('select * from `class_list` where `id`=? limit 1', [id], function (err, list) {
        if (err) return callback(err);
        if(!(list.length > 0)) return callback(new Error('该分类不存在'));

        callback(null, list[0]);
    });
};

/**
 * 获取指定文章的详细信息
 *
 * @param {Number} id
 * @param {Function} callback
 */
exports.article = function (id, callback) {
    debug('获取指定文章的详细信息：%s', id);

    var sql = 'select * from `article_list` as `a`' +
        ' left join `article_detail` as `b` on `a`.`id`=`b`.`id`' +
            ' where `a`.`id`=? limit 1';
    db.query(sql,[id], function (err, list) {
        if (err) return callback(err);
        if(!(list.length > 0)) return callback(new Error('该文章不存在'));

        callback(null, list[0]);
    });
};

/**
 * 获取指定分类下的文章列表
 *
 * @param {Number} classId
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} callback
 */
exports.articleListByClassId = function (classId, offset, limit, callback) {
    debug('获取指定分类下的文章列表：%s, %s, %s', classId, offset, limit );

    var sql = 'select * from `article_list` as `a`' +
        ' left join `article_detail` as `b` on `a`.`id`=`b`.`id`' +
        ' where `a`.`class_id`=? order by `created_time` desc limit ?,?';
    db.query(sql, [classId, offset, limit], callback);
};

/**
 * 获取指定标签下的文章列表
 *
 * @param {String} tag
 * @param {Number} offset
 * @param {Number} limit
 * @param {Function} callback
 */
exports.articleListByTag = function (tag, offset, limit, callback) {
    debug('获取指定标签下的文章列表：%s, %s, %s', tag, offset, limit);

    var sql = 'select * from `article_list` where `id` in (select `id` from `article_tag` where `tag`=?)' +
        ' order by `created_time` desc limit ?,?';
    db.query(sql, [tag, offset, limit], callback);
};


/**
 * 获取指定标签下的文章数量
 *
 * @param {String} tag
 * @param {Function} callback
 */
exports.articleCountByTag = function (tag, callback) {
    debug('获取指定标签下的文章数量：%s', tag);

    db.query('select count(*) as `c` from `article_tag` where `tag`=?', [tag], function (err, ret) {
        if (err) return callback(err);

        callback(null, ret[0].c);
    });
};



