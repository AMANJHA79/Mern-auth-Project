const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token=req.cookies.token;
    try{
        if(!token){
            return res.status(401).json({ message: 'You need to login first' });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.userId=decoded.userId;
        next();

    }
    catch(err){
        console.log(`error in verifyToken: ${err}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = verifyToken;