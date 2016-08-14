/**
 * Created by spray on 16-8-10.
 */

const request = require('request');
const fs      = require('fs');

try {
    request.get('http://s13.sinaimg.cn:7999/tt.txt')
        .on('error', function (err) {
            if (err) {
                console.log('try',err);
            }

        }).pipe(fs.createWriteStream('./doodle.txt'));
}
catch(e){
    console.log('catch', e.code);
}
finally{
    setTimeout(function () {
        console.log("entering and leaving the finally block");
    }, 30*1000);

}