const {logger} = require("#src/middlewares/logger");
const Database = require("#src/db/database");
const {CRYPTOPANIC_API_KEY, CRYPTOCOMPARE_API_KEY, COINMARKET_CAP_API_KEY} = require("#src/services/keys");

async function getRequest(url, params = '', headers = {}) {
    const response = await fetch(url + params, {headers});
    if (!response.ok) {
        logger.error(`HTTP error! status: ${response.status} for url ${url} and params ${params}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

const getUrls = {

    trending: 'https://api.coingecko.com/api/v3/search/trending',

    coinsInfo: 'https://api.coingecko.com/api/v3/coins/list',

    topMarketCapCoins: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true',

    ohlc: 'https://min-api.cryptocompare.com/data/v2/histoday',

    headlines: 'https://cryptopanic.com/api/v1/posts/?auth_token=' + CRYPTOPANIC_API_KEY + '&public=true&kind=news',

    dataForSymbol: (symbol) => `https://data-api.cryptocompare.com/asset/v1/data/by/symbol?asset_symbol=${symbol}&api_key=$${CRYPTOCOMPARE_API_KEY}`,

    dataForSymbolV2: (symbol) => ({
        url: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbol}`,
        headers: {
            'X-CMC_PRO_API_KEY': COINMARKET_CAP_API_KEY,
        }
    }),


};


const getTopMarketCapCoins = async () => {
    return await getRequest(getUrls.topMarketCapCoins);
};

const getTrending = async () => {
    return await getRequest(getUrls.trending);
};

const checkIfCoinsInfoIsStale = async (trendingCoins) => {
    const db = Database.db;
    // check if every coin in trendingCoins is in db
    const currentCoins = await new Promise((resolve, reject) => {
        db.all(`SELECT *
                FROM coins`, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
    if (!currentCoins || currentCoins.length === 0) {
        logger.info('no coins in db');
        return true;
    }
    const currentCoinsIds = currentCoins.map(coin => coin.id);
    const trendingCoinsIds = trendingCoins.map(coin => coin.item.id);
    const missingCoins = trendingCoinsIds.filter(id => !currentCoinsIds.includes(id));
    if (missingCoins.length > 0) {
        logger.info(`missing coins: ${missingCoins}`);
        return true;
    }
    return false;

    // const sql = `SELECT last_updated FROM meta_data WHERE table_name = ?`;
    // const table = 'coins';
    // const lastUpdated = await db.get(sql, [table]);
    // await db.close();
    // const now = new Date();
    // const lastUpdatedDate = new Date(lastUpdated.last_updated);
    // const diff = now - lastUpdatedDate;
    // const minutes = Math.floor(diff / 1000 / 60);
    // logger.info(`coins info is ${minutes} minutes old`);
    // return minutes > 24 * 60;
};

const getCoinsInfo = async () => {
    return await getRequest(getUrls.coinsInfo);
};

const storeCoinsInfoInDb = async () => {
    const coins = await getCoinsInfo();
    const db = Database.db;
    const sql = `INSERT INTO coins (id, symbol, name)
                 VALUES (?, ?, ?)`;

    const insertPromises = coins.map(coin => {
        return new Promise((resolve, reject) => {
            db.run(sql, [coin.id, coin.symbol, coin.name], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    await Promise.all(insertPromises);

    const sql2 = `INSERT INTO meta_data (table_name, last_updated)
                  VALUES (?, ?)`;
    await new Promise((resolve, reject) => {
        db.run(sql2, ['coins', new Date().toISOString()], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    await db.close();
    logger.info('done storing coins info in db');
};

const getOhlc = async (symbol = 'btc', vsCurrency = 'usd', days = 90) => {
    const params = `?fsym=${symbol}&tsym=${vsCurrency}&limit=${days}`;
    return await getRequest(getUrls.ohlc, params);
};

const getHeadlinesForCoin = async (coinId, page = 1) => {
    const params = coinId ? `&currencies=${coinId}` : '';
    logger.info(`getting headlines for coin ${coinId} page ${page}`);
    return await getRequest(getUrls.headlines, params + `&page=${page}`);
};

const getDataForSymbol = (symbol) => {
    //      cryptoCompare
    return getRequest(getUrls.dataForSymbol(symbol));
};

const getDataForSymbolV2 = (symbol) => {
    //     coinMarketCap
    let {url, headers} = getUrls.dataForSymbolV2(symbol);
    return getRequest(url, '', headers);
};

if (require.main === module) {
    checkIfCoinsInfoIsStale().then(isStale => console.log(isStale));
}


module.exports = {
    getTrending,
    getCoinsInfo,
    storeCoinsInfoInDb,
    getOhlc,
    checkIfCoinsInfoIsStale,
    getTopMarketCapCoins,
    getHeadlinesForCoin,
    getDataForSymbol,
    getDataForSymbolV2,
};