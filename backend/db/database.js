// create a database class that is a singleton and also uses the file cryptodb.sqlite


// Path: backend/db/database.js

// Path: backend/db/database.js

const sqlite3 = require('sqlite3').verbose();
const logger = require("#src/logger");

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        Database.instance = this;

        // Initialize your database connection here
        this.db = new sqlite3.Database('db/cryptodb.sqlite', (err) => {
            if (err) {
                logger.error('Could not connect to database', err);
            } else {
                logger.info('Connected to database');
            }
        });
    }

    // Add your database methods here
}

module.exports = new Database();
