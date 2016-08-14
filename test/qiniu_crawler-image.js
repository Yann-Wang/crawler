/**
 * Created by spray on 16-8-9.
 */


//文件上传  公开空间

var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ';
qiniu.conf.SECRET_KEY = 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN';

//要上传的空间
bucket = 'crawler-image';

//上传到七牛后保存的文件名
key = 'test.js';

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket, key);

//要上传文件的本地路径
filePath = './async.js';

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}

//调用uploadFile上传
uploadFile(token, key, filePath);


