const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { query, initializeDB } = require('./db');
const { generateToken, verifyToken } = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const frontendPath = path.join(process.cwd(), 'public');
app.use(express.static(frontendPath, { index: 'register.html' }));

// Routes

// 1. User Registration
app.post('/register', async (req, res) => {
    const { uname, password, email, phone } = req.body;
    try {
        await query(
            'INSERT INTO customer (cname, cpassword, email, phone) VALUES (?, ?, ?, ?)',
            [uname, password, email, phone]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// 2. User Login
app.post('/login', async (req, res) => {
    const { uname, password } = req.body;
    try {
        const users = await query('SELECT * FROM customer WHERE cname = ? AND cpassword = ?', [uname, password]);
        if (users.length > 0) {
            const user = users[0];
            const token = generateToken({ uname: user.cname, role: 'customer' });

            // Store token in CJWT table
            const expiry = new Date(Date.now() + 3600000); // 1 hour
            await query('INSERT INTO CJWT (token, cid, exp) VALUES (?, ?, ?)', [token, user.cid, expiry]);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });

            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// 3. Get Balance (Protected)
app.post('/getBalance', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized: Invalid token' });

    try {
        const users = await query('SELECT balance FROM customer WHERE cname = ?', [decoded.sub]);
        if (users.length > 0) {
            res.json({ balance: users[0].balance });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get Balance Error:', error);
        res.status(500).json({ message: 'Error fetching balance' });
    }
});

// Final middleware to serve the frontend shell for any unhandled GET request
app.use((req, res) => {
    if (req.method === 'GET' && !res.headersSent) {
        res.sendFile(path.resolve(frontendPath, 'register.html'));
    }
});

const server = app.listen(PORT, async () => {
    console.log(`Kodbank Server running on http://localhost:${PORT}`);
    console.log(`Frontend path: ${frontendPath}`);
    await initializeDB();
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});

module.exports = app;
