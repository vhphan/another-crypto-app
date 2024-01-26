const express = require('express');
const {cache30m, cache1h} = require("../middlewares/cache");
const asyncHandler = require("../middlewares/async");
const {checkIfCoinsInfoIsStale} = require("#src/services/cryptoData");
const router = express.Router();

router.get('/hello', (req, res) => {
    res.json({
        message: 'Hello World From The Backend!'
    });
});


const delay = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};


router.get('/wait', async (req, res) => {
    const start = Date.now();
    await delay(req.query.delay || 1000);
    const end = Date.now();
    res.json({
        message: 'Hello World From The Backend with delay!',
        delay: req.query.delay || 1000,
        start,
        end,
        duration: end - start
    });
});

router.get('/trending', cache30m, asyncHandler(async (req, res) => {
        const {getTrending} = require("../services/cryptoData");
        const trending = await getTrending();
        (checkIfCoinsInfoIsStale(trending["coins"])).then(isStale => {
                if (isStale) {
                    const {storeCoinsInfoInDb} = require("#src/services/cryptoData");
                    storeCoinsInfoInDb().then(r => console.log('done storing coins info in db'));
                }
            }
        );
        res.json({
            success: true,
            data: trending
        });
    }
));

router.get('/topCoins', cache1h, asyncHandler(async (req, res) => {
        const {getTopMarketCapCoins} = require("../services/cryptoData");
        const coins = await getTopMarketCapCoins();
        res.json({
            success: true,
            data: coins
        });
    }
));

router.get('/ohlc', asyncHandler(async (req, res) => {
            const {getOhlc} = require("../services/cryptoData");
            const {symbol, days} = req.query;
            const ohlc = await getOhlc(symbol, 'usd', days);
            res.json({
                success: true,
                data: ohlc
            });
        }
    )
);

module.exports = router;
