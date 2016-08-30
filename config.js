/**
 * Created by spray on 16-8-5.
 */
//MySQL数据库连接配置
const mysql = require('mysql');

//连接池
exports.db = mysql.createPool({
    host: '192.168.68.128',
    database: 'sina_blog',
    user:  'root',
    password: 'root',
    connectionLimit : 10  //最大连接数，　默认为10
});

exports.sinaBlog = {
    url: 'http://blog.sina.com.cn/u/1776757314'   //博客首页地址
};

exports.port = 3000;

//定时更新
exports.autoUpdate = '00 00 00 * * *';　//任务执行规则，参考cron语法

exports.dataDir = '/home/spray/crawler/data/';

//七牛云存储，crawler-image　存储空间
exports.storeDir = 'obkljd9pl.bkt.clouddn.com/';

// http proxy list
exports.proxyList = [
    'http://120.198.248.96:80',
    'http://111.13.136.46:80',
    'http://122.96.59.104:80',
    'http://124.88.67.9:80',
    'http://120.198.248.97:80',
    'http://119.6.136.122:80',
    'http://103.27.24.239:80',
    'http://103.27.24.235:80',
    'http://111.13.136.46:80',
];


