// Import crypto for secure random number generation
const crypto = require('crypto');

/**
 * Generates a cryptographically secure 6-digit verification code
 * @returns {string} A random 6-digit number as a string
 */
const generateVerificationCode = () => {
    // Generate a random number between 100000 and 999999 (6 digits)
    return String(crypto.randomInt(100000, 1000000));
}

module.exports = generateVerificationCode;
