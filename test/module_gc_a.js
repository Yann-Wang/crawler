/**
 * Created by spray on 16-8-12.
 */
let array = [1,2,3,4,5,6];
let count = 0;

exports.test = function () {
    let arrayi = array[count];
    count = (++count)%6;
    console.log(arrayi);
};