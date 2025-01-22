const crypto = require('crypto');

const generateVerificationCode = () => {
    return crypto.randomBytes(6).toString('hex');
}

module.exports = generateVerificationCode;
