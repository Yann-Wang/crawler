/**
 * Created by spray on 16-8-13.
 */

const qiniu   = require('node-qiniu');

qiniu.config({
    access_key: 'C21AMgqY5aVOyhdZjMbyeMe_VaFjUAPoVQkMTJrQ',
    secret_key: 'L8taeU0aodSfz3wDuadr72fqz1cLg1HtVDxOADnN'
});

//要上传的空间
let bucket = 'crawler-image';

//上传到七牛后保存的文件名
let key = 'test.js';

var imagesBucket = qiniu.bucket(bucket);

var picture = imagesBucket.key(key);

picture.stat(function(err, stat) {
    if (err) {
        return console.error('error', err);
    }

    console.dir(stat);
    /**
     * {
   *   hash     : <FileEtag>, // string 类型，文件的Hash值
   *   fsize    : <FileSize>, // int 类型，文件的大小(单位: 字节)
   *   mimeType : <MimeType>, // string 类型，文件的媒体类型，比如"image/gif"
   *   putTime  : <PutTime>   // int64 类型，文件上传到七牛云的时间(Unix时间戳)
   * }
     */
});