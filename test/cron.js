/**
 * Created by spray on 16-8-5.
 */
const cronJob = require('cron').CronJob;

var job1 = new cronJob('00 */1 * * * *', function () {
    console.log('每１分执行一次' + new Date());
});

job1.start();