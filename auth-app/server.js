const express = require('express');
const connectDB = require('./config/db'); // Pastikan jalur ini benar
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware (misalnya, body-parser, dll)
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));


// Route
app.get('/', (req, res) => res.send('API is running'));

// Port server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
