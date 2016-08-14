/**
 * Created by spray on 16-8-5.
 */
const request = require('request');
const cheerio = require('cheerio');
const mysql   = require('mysql');
var   debug   = require('debug')('blog:update');

//创建数据库连接
var db = mysql.createConnection({
    host: '192.168.68.144',
    port: 3306,
    database: 'sina_blog',
    user:  'root',
    password: 'root'
});

//显示所有数据库表
db.query('show tables', function (err, tables) {
    if (err){
        console.error(err.stack);
    } else {
        console.log(tables);
    }

    //关闭连接
    db.end();
});