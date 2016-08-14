/**
 * Created by spray on 16-8-1.
 */
const cheerio = require('cheerio');
const request = require('request');




//读取博文页面
var url = 'http://blog.sina.com.cn/s/blog_69e72a420101gkp5.html';
request(url, function (err, res) {
    if (err) return callback(err);

    //根据网页内容创建DOM操作对象
    var $ = cheerio.load(res.body.toString());

    var imgList = $('.articalContent img');

    //imgList[0] 属性
    //type, name, attribs, children, next, prev, parent
    //

    console.log(imgList[0].attribs.real_src);
    imgList[0].attribs.src = 'http://www.baidu.com/';

    console.log($.html('.articalContent'));


});



