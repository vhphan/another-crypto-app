const onlyStatus200 = (req, res) => res.statusCode === 200;


const cache10m = require('apicache').options({
    debug: true
}).middleware('10 minutes', onlyStatus200);

const cache30m = require('apicache').options({
    debug: true
}).middleware('30 minutes', onlyStatus200);

const cache1h = require('apicache').options({
    debug: true
}).middleware('1 hour', onlyStatus200);

const cache6h = require('apicache').options({
    debug: true
}).middleware('6 hours', onlyStatus200);

const cache12h = require('apicache').options({
    debug: true
}).middleware('12 hours', onlyStatus200);

const cache24h = require('apicache').options({
    debug: true
}).middleware('24 hours', onlyStatus200);


module.exports = {
    cache10m,
    cache30m,
    cache1h,
    cache6h,
    cache12h,
    cache24h,
};