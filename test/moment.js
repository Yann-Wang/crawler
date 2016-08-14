/**
 * Created by spray on 16-8-8.
 */
const moment = require('moment');

var year = moment('2011-11-05 17:15:00').toObject().years;
console.log(year);