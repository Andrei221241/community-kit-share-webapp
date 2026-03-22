const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'sd2-db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

const promisePool = pool.promise();

function testConnection(retries = 10) {
    pool.query('SELECT 1', (err) => {
        if (err) {
            console.error(`DB not ready, retrying... (${retries} left)`, err.message);
            if (retries > 0) setTimeout(() => testConnection(retries - 1), 3000);
        } else {
            console.log('✅ Connected to MySQL database');
        }
    });
}

testConnection();

module.exports = promisePool;