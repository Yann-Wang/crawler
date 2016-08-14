/**
 * Created by spray on 16-8-8.
 */

//文件下载

var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ';
qiniu.conf.SECRET_KEY = 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN';

//构建私有空间的链接
url = 'http://objdxwrlf.bkt.clouddn.com/test.js';
var policy = new qiniu.rs.GetPolicy();

//生成下载链接url
var downloadUrl = policy.makeRequest(url);

//打印下载的url
console.log(downloadUrl);

//http://objdxwrlf.bkt.clouddn.com/test.js?e=1470648320&token=C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ:DVIQwpGcJjg98HocssGuKfbULRY=

