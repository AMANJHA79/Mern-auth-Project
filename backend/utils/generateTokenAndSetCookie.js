const jwt = require('jsonwebtoken');

// Middleware for token verification

const generateTokenAndSetCookie = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    let token;
    try {
        token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    } catch (error) {
        console.error('Error signing token:', error);
        throw new Error('Token generation failed');
    }

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Cookie will only be sent over HTTPS in production environment
        sameSite: 'strict', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

module.exports = generateTokenAndSetCookie;

