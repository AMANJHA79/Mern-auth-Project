const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World');
});


const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());//handel incoming json request 




//Routes

app.use('/api/v1/auth',authRoutes);   




app.listen(port,async () => {
    await connectDB();
  console.log(`Server is running on port ${port}`);
});

