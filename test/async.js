/**
 * Created by spray on 16-8-2.
 */
const async = require('async');

async.series([
    function (done) {
        console.log(1);
        done();

    },
    function (done) {
        console.log(2);
        done('exist');

    },
    function (done) {
        console.log(3);
        done();

    }
], function (err) {
    if (err == 'exist'){
        console.log('完成');
    }

});