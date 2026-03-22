// Import the mysql2 library for connecting to MySQL
const mysql = require('mysql2');

// Load environment variables from the .env file (e.g. DB host, user, password)
require('dotenv').config();

// Create a connection pool instead of a single connection
// A pool manages multiple connections efficiently - better for a web app
// where multiple users might be making requests at the same time
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'db',         // Docker service name 'db' (not localhost!)
    user: process.env.MYSQL_USER || 'root',        // MySQL username from .env
    password: process.env.MYSQL_PASSWORD || 'password', // MySQL password from .env
    database: process.env.MYSQL_DATABASE || 'sd2-db',   // Database name from .env
    port: process.env.DB_PORT || 3306,             // MySQL default port
    waitForConnections: true,   // Queue requests if all connections are busy
    connectionLimit: 10,        // Maximum number of simultaneous connections
});

// Convert the pool to use Promises so we can use async/await in controllers
// Without this, db.query() would use callbacks instead of async/await
const promisePool = pool.promise();

// Test the database connection on startup with retry logic
// This is needed because the web container starts before MySQL is fully ready
function testConnection(retries = 10) {
    // Run a simple query to check if the DB is ready
    pool.query('SELECT 1', (err) => {
        if (err) {
            // If connection fails, log the error and try again after 3 seconds
            console.error(`DB not ready, retrying... (${retries} left)`, err.message);
            if (retries > 0) setTimeout(() => testConnection(retries - 1), 3000);
        } else {
            // Connection successful
            console.log('✅ Connected to MySQL database');
        }
    });
}

// Run the connection test when the app starts
testConnection();

// Export the promise-based pool so controllers can use await db.query()
module.exports = promisePool;