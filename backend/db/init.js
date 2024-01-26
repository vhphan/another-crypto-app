const {storeCoinsInfoInDb} = require("#src/services/cryptoData");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/cryptodb.sqlite');
const createTables = async () => {

    const sql1 = `
        CREATE TABLE IF NOT EXISTS coins
        (
            id     TEXT NOT NULL,
            symbol TEXT NOT NULL,
            name   TEXT NOT NULL
        );
    `;
    await db.run(sql1);

    const sql2 = `
        CREATE TABLE IF NOT EXISTS meta_data
        (
            table_name   TEXT NOT NULL,
            last_updated TEXT NOT NULL
        );
    `;
    await db.run(sql2);
    await db.close();
};

//check if main module
if (require.main === module) {
    createTables().then(r => console.log('done initializing db'));
    storeCoinsInfoInDb().then(r => console.log('done storing coins info in db'));
}

module.exports = {
    createTables
};