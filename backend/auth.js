const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'kodbank_premium_secret_key_2026';

function generateToken(user) {
    const payload = {
        sub: user.uname,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
