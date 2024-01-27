const {logger} = require("#src/middlewares/logger");
const Database = require("#src/db/database");

const getTopMarketCapCoins = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true';
    const response = await fetch(url);
    return await response.json();
};

const getTrending = async () => {
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    const response = await fetch(url);
    return await response.json();
};

const checkIfCoinsInfoIsStale = async (trendingCoins) => {
    const db = Database.db;
    // check if every coin in trendingCoins is in db
    const currentCoins = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM coins`, (err, rows) => {
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
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const response = await fetch(url);
    return await response.json();
};

const storeCoinsInfoInDb = async () => {
    const coins = await getCoinsInfo();
    const db = Database.db;
    const sql = `INSERT INTO coins (id, symbol, name) VALUES (?, ?, ?)`;

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

    const sql2 = `INSERT INTO meta_data (table_name, last_updated) VALUES (?, ?)`;
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
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday';
    const params = `?fsym=${symbol}&tsym=${vsCurrency}&limit=${days}`;
    const response = await fetch(url + params);
    return await response.json();
};

if (require.main === module) {
    // getTrending().then(data => console.log(data));
    // getCoinsInfo().then(data => console.log(data));
    // storeCoinsInfoInDb().then(() => console.log('done storing coins info in db'));
    // getOhlc('btc').then(data => console.log(data));
    checkIfCoinsInfoIsStale().then(isStale => console.log(isStale));
    // getTopMarketCapCoins().then(data => console.log(data));
}

module.exports = {
    getTrending,
    getCoinsInfo,
    storeCoinsInfoInDb,
    getOhlc,
    checkIfCoinsInfoIsStale,
    getTopMarketCapCoins,
};