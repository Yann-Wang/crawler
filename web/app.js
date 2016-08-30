const express = require('express');
const debug   = require('debug')('blog:web:app');
const path    = require('path');
const read    = require('./read');
const config  = require('../config');
//const spawn   = require('child_process').spawn;
//const cronJob = require('cron').CronJob;
const fs      = require('fs-extra');

const Image   = require('./routes/Image');

//export DEBUG=blog:web:*
//启动：node ./web/bin/www

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname,'public')));


//网站首页
app.get('/', function (req, res, next) {
    //articleListByClassId 的第一个参数是文章分类的ID
    //第二个参数是返回结果的开始位置
    //第三个参数是返回结果的数量
    read.articleListByClassId(0,0,20, function (err, list) {
        if (err) return next(err);
        //渲染模板
        res.locals.articleList = list;
        res.render('index');
    });
});


//文章页面
app.get('/article/:id', function (req, res, next) {

    read.article(req.params.id, function (err, article) {
        if (err) return next(err);
        var path = '/home/spray/crawler/data/' + article.path + article.id + '.html';

        fs.readFile(path, function (err, data) {
            if (err) return next(err);
            article.content = data;
            //渲染模板
            res.locals.article = article;

            res.render('article');
        });
    });
});

app.use('/img',Image);

/*
//定时执行更新任务
var job = new cronJob(config.autoUpdate, function () {
    debug('开始执行定时更新任务');
    var update = spawn(process.execPath, [path.resolve(__dirname, '../update/all.js')]);
    update.stdout.pipe(process.stdout);
    update.stderr.pipe(process.stderr);
    update.on('close', function (code) {
        debug('更新任务结束，代码=%d', code);
    });
});

job.start();
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.on('uncaughtException', function (err) {
    console.error('uncaughtException: %s', err.stack);
});


module.exports = app;
