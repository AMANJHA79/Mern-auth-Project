// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true        // Ensures email uniqueness across users
    },
    password: {
        type: String,
        required: true      // Stores hashed password
    },
    name: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now() // Tracks user's last login timestamp
    },
    isVerified: {
        type: Boolean,
        default: false      // Email verification status
    },
    resetPasswordToken: {
        type: String        // Token for password reset functionality
    },
    resetPasswordExpiresAt: {
        type: Date          // Expiration timestamp for reset token
    },
    verificationToken: {
        type: String        // Token for email verification
    },
    verificationTokenExpiresAt: {
        type: Date          // Expiration timestamp for verification token
    }
}, {
    timestamps: true        // Automatically manage createdAt and updatedAt
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;