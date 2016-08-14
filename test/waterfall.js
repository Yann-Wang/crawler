/**
 * Created by spray on 16-8-9.
 */
const async = require('async');

async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        console.log(arg1, arg2);
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        console.log(arg1);
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    console.log(result);
    // result now equals 'done'
});