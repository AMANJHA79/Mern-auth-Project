// Import Mongoose for MongoDB operations
const mongoose = require('mongoose');

/**
 * Database Connection Configuration
 * Establishes connection to MongoDB using environment variables
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try{
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    }
    catch(err){
        // Log error and exit process on connection failure
        console.log(`error connecting db ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;