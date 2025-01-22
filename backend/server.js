const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');

// Initialize Express application
const app = express();

// Basic route for server health check
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Server configuration
const port = process.env.PORT || 3000;

// Global Middleware Configuration
app.use(express.json()); // Parse JSON payloads
app.use(cookieParser()); // Parse Cookie header and populate req.cookies
app.use(helmet()); // Secure app by setting various HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // HTTP request logger

// API Routes Configuration
app.use('/api/v1/auth', authRoutes);   

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server and establish database connection
app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});

