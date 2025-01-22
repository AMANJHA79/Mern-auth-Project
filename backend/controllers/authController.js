// Import required models, libraries and utilities
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateVerificationCode = require('../utils/generateVerificationCode');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail } = require('../utils/emails');

/**
 * User Registration Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with registration status
 */
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        // Validate required fields
        if(!name || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Validate email format
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Hash password and generate verification token
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours 
        });

        await user.save();

        // Generate JWT and set cookie
        generateTokenAndSetCookie(res, user._id);
        
        // Send welcome and verification emails
        await sendWelcomeEmail(email, name);
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.'
        });
    }
    catch(err){
        console.log(`error in signup: ${err}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * Email Verification Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with verification status
 */
const verifyEmail = async (req,res) => {
    const { code } = req.body;
    try{
        // Find user with valid verification token
        const user = await User.findOne({ 
            verificationToken: code,
            verificationTokenExpiresAt: { $gte: new Date() }
        });
        
        if(!user){
            return res.status(400).json({ message: 'Invalid verification code or expired link' });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();
        
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. Please log in.'
        });
    }
    catch(err){
        console.log(`error in verifyEmail: ${err}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

const login = async (req, res) => {
    const { email , password}= req.body;
    try{
        if(!email ||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if(!user ||!user.isVerified){
            return res.status(401).json({ message: 'Email or password is incorrect or account is not verified' });
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if(!isPasswordvalid){
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }
        
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user
        })

    }
    catch(err){
        console.log(`error in login: ${err}`);
        res.status(500).json({ message: 'Server Error' });
        
    }
    

}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'User logged out successfully.' });

    
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try{
        if(!email){
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        //generetae rest token 

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        
        // Send password reset email

        await sendPasswordResetEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
        res.status(200).json({
            success: true,
            message: 'Reset password email sent successfully. Please check your email for further instructions.'
        })

    }
    catch(err){
        console.log(`error in forgotPassword: ${err}`);
        res.status(500).json({ message: 'Server Error' });
        
    }

}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gte: new Date() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;
        await user.save();
        
        // Send password reset success email
        await sendResetSuccessEmail(user.email);
        
        res.status(200).json({
            success: true,
            message: 'Password reset successful. Please log in with your new password'
        });
        
    } catch (error) {
        console.log(`error in resetPassword: ${error}`);
        res.status(500).json({ message: 'Server Error' });
        
    }

}

// middleware to check if user is authenticated
const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(`error in checkAuth: ${error}`);
        res.status(500).json({ message: 'Server Error' });
        
    }
}

module.exports = { signup, login, logout  , verifyEmail , forgotPassword , resetPassword , checkAuth};