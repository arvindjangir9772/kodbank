const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Database Configuration Check:', {
    host: process.env.DB_HOST ? 'Detected ✅' : 'NOT DETECTED ❌',
    user: process.env.DB_USER ? 'Detected ✅' : 'NOT DETECTED ❌',
    db: process.env.DB_NAME ? 'Detected ✅' : 'NOT DETECTED ❌',
    port: process.env.DB_PORT || '3306 (Default)'
});

if (!process.env.DB_HOST) {
    console.error('CRITICAL: DB_HOST environment variable is missing.');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function initializeDB() {
    try {
        // Table 'customer' matching diagram
        await query(`
            CREATE TABLE IF NOT EXISTS customer (
                cid INT AUTO_INCREMENT PRIMARY KEY,
                cname VARCHAR(255) UNIQUE NOT NULL,
                cpassword VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                balance DECIMAL(15, 2) DEFAULT 100000.00
            )
        `);

        // Table 'CJWT' matching diagram
        await query(`
            CREATE TABLE IF NOT EXISTS CJWT (
                tid INT AUTO_INCREMENT PRIMARY KEY,
                token TEXT NOT NULL,
                cid INT NOT NULL,
                exp DATETIME NOT NULL,
                FOREIGN KEY (cid) REFERENCES customer(cid)
            )
        `);
        console.log('Aiven MySQL tables (customer, CJWT) initialized successfully.');
    } catch (error) {
        console.error('Error initializing Aiven MySQL:', error);
    }
}

module.exports = { query, initializeDB };
