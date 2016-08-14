/**
 * Created by spray on 16-8-8.
 */

exports.wrap = function (cnt) {
    var front = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body><div style="width:730px;margin:0 auto;">';
    var back  = '<\/div><\/body><\/html>';
    return front + cnt + back;
};