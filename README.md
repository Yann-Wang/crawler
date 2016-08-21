# crawler
- 该爬虫项目包括两部分：爬取页面和展示页面
- 该项目以＜＜Node.js实战＞＞(赵坤,寸志,雷宗民,吴中骅著)这本书的第６章为原型.
- 爬取的站点是[柳絮同学的新浪博客](http://blog.sina.com.cn/u/1776757314). 

## 启动
- 爬取页面部分

```shell
cd update
node all.js
```

- 展示页面部分

```shell
cd web
node ./bin/www
```


## main package
- 爬取页面部分
  
    request, async, mysql, node-qiniu
  
- 展示页面部分

    express, cron, mysql

## features

#### 将博客中的文章存储在本地文件系统中

1. 原型中的文章内容是以字符串的形式直接存储在MySQL数据库中的，这不是实际项目中的存储方式．实际项目中网页文件一般是放在本地文件系统中．

2. 将数据库article_detail表中content字段改为path字段，用来存储网页文件的本地存储路径．

3. 一般而言，读取本地文件的速度要比读数据库要快．


####  将文章中的图片爬取出来并存入七牛云
1. 原型中爬取下来的文章，并没有对所引用的图片的链接地址做修改，由于这些图片存储于新浪cdn上，并限制了外链站点，所以在自己本地服务器中访问爬取的文章时，引用的图片是无法显示的．

2. 本项目在将爬取的文章保存到本地之前，先将文章中所引用的图片爬取下来并上传到七牛云，然后修改文章的图片引用链接为七牛云中对应图片的访问地址．这样文章中的图片就可以正常显示了．

#### 使用MySQL连接池
- 通过连接池来管理多个数据库连接

#### 断点续爬
1. 对于文章列表中的链接，在爬取之前先去查看本地是否已存在该文章，如果存在，则跳过该链接．

2. 考虑到本项目爬取的是静态博客网站，在首次爬取和断点续爬的间隔中文章被修改的可能性较低，所以不去考虑文章的更改．

#### 处理econnrefused/econnreset/socket hangs up异常（连接被拒绝/连接被重置/socket挂起）
1. 在使用request模块请求网页文件时，经常抛出econnrefused/econnreset/socket hangs up异常，从而导致爬虫进程直接挂掉．

2. google了一下发现是新浪服务器那边的反爬虫机制在搞鬼，它应该是临时把我的ip封了，所以我使用了代理服务器（从网上搜了一些代理服务器ip并在使用request模块时启用代理服务器来请求），并且每次请求使用不同的代理服务器ip．增加两次请求之间的时间间隔，给request模块配置请求头（Accept和Agent字段），以此来降低ip被封的可能性．

3. 虽然做了一些防御措施，但是新浪服务器的反爬虫机制很强大，还是有挂的情况出现，所以在request代码段的外面使用try/catch来捕获异常，一旦捕获异常，则更换ip重新请求．

#### 使用pipe以stream的形式爬取图片并上传七牛云
1. 如果读取流抛异常，会导致写入流也抛异常，所以要分别给读取流和写入流定义error事件处理函数．

#### 记录异常
1. 将捕获的uncaughtException异常写入crawler.log


## 有待改进的地方

#### 数据库设计
- 原型中的数据库设计完全遵循第三范式，但是读取效率不高，可以把article_list和article_detail表合并，避免了表连接查询．

#### 增加展示页面的文章样式
- 文章页面的样式略显单调，可以把统一的样式写入css文件，并注入article模板
  
  
  
###### 本项目遵守MIT协议