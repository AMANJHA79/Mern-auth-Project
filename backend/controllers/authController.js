const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateVerificationCode = require('../utils/generateVerificationCode');
const emailBrevo = require('../utils/email-brevo');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

//signup function
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken= generateVerificationCode();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours 
        });

        await user.save();

        //jwt token 
        generateTokenAndSetCookie(res,user._id);

        //send verification email
        await emailBrevo(user,verificationToken)
        

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.'
        })

    }
    catch(err){
        console.log(`error in signup: ${err}`);
        res.status(500).json({ message: 'Server Error' });
        
    }

}

const login = async (req, res) => {
    res.send('login success')
    

}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'User logged out successfully.' });

    
}


module.exports = { signup, login, logout };

