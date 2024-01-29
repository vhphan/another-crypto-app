const express = require('express');
const {cache30m, cache1h} = require("../middlewares/cache");
const asyncHandler = require("../middlewares/async");
const {checkIfCoinsInfoIsStale} = require("#src/services/cryptoData");
const {cache10m} = require("#src/middlewares/cache");
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
        const {getTrending} = require("#src/services/cryptoData");
        const trending = await getTrending();
        (checkIfCoinsInfoIsStale(trending["coins"])).then(isStale => {
                if (isStale) {
                    const {storeCoinsInfoInDb} = require("#src/services/cryptoData");
                    storeCoinsInfoInDb().then(() => console.log('done storing coins info in db'));
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
        const {getTopMarketCapCoins} = require("#src/services/cryptoData");
        const coins = await getTopMarketCapCoins();
        res.json({
            success: true,
            data: coins
        });
    }
));

router.get('/ohlc', cache10m, asyncHandler(async (req, res) => {
            const {getOhlc} = require("#src/services/cryptoData");
            const {symbol, days, vsCurrency} = req.query;
            const ohlc = await getOhlc(symbol.toLowerCase(), vsCurrency.toLowerCase(), days);
            res.json({
                success: true,
                data: ohlc?.Data?.Data,
                params: req.query
            });
        }
    )
);

router.get('/headlines', cache30m, asyncHandler(async (req, res) => {
            const {getHeadlinesForCoin} = require("#src/services/cryptoData");
            const {coinId} = req.query;
            const headlines = await getHeadlinesForCoin(coinId);
            res.json({
                success: true,
                data: headlines?.results,
                params: req.query
            });
        }
    )
);

module.exports = router;
