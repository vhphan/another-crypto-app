const sqlite3 = require('sqlite3').verbose();
const {logger} = require("#src/middlewares/logger");

const getTopMarketCapCoins = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const response = await fetch(url);
    return await response.json();
}

const getTrending = async () => {
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    const response = await fetch(url);
    return await response.json();
};

const checkIfCoinsInfoIsStale = async (trendingCoins) => {
    const db = new sqlite3.Database('db/cryptodb.sqlite');
    // check if every coin in trendingCoins is in db
    const currentCoins = await db.all(`SELECT * FROM coins`);
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
}

const getCoinsInfo = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const response = await fetch(url);
    return await response.json();
};

const storeCoinsInfoInDb = async () => {
    const coins = await getCoinsInfo();
    const db = new sqlite3.Database('db/cryptodb.sqlite');
    const sql = `INSERT INTO coins (id, symbol, name) VALUES (?, ?, ?)`;
    coins.forEach(coin => {
        db.run(sql, [coin.id, coin.symbol, coin.name]);
    });

    const sql2 = `INSERT INTO meta_data (table_name, last_updated) VALUES (?, ?)`;
    db.run(sql2, ['coins', new Date().toISOString()]);

    await db.close();
    logger.info('done storing coins info in db');
};

const getOhlc = async (symbol, vsCurrency, days) => {
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday';
    const params = `?fsym=${symbol}&tsym=${vsCurrency}&limit=${days}`;
    const response = await fetch(url + params);
    return await response.json();
};


module.exports = {
    getTrending,
    getCoinsInfo,
    storeCoinsInfoInDb,
    getOhlc,
    checkIfCoinsInfoIsStale,
    getTopMarketCapCoins,
};