const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    lastLogin:{
        type: Date,
        default: Date.now()
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpiresAt:{
        type: Date
    },
    verificationToken:{
        type: String
    },
    verificationExpiresAt:{
        type: Date
    }

},{
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;