const express = require('express');
const connectDB = require('./auth-app/config/db'); // Ensure the path is correct
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies for JWT

// Serve static files for landing and home pages
app.use(express.static('landing')); // index.html for login/register
app.use(express.static('home'));    // home.html for home page

// Route to serve index.html explicitly at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing', 'index.html'));
  });

// Authentication Routes
app.use('/api/auth', require('./auth-app/routes/authRoutes'));

// Authentication Middleware for Home Route
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.redirect('/');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect('/');
    req.user = user;
    next();
  });
};

// Protect the /home route
app.get('/home', authenticateToken, (req, res) => {
  res.sendFile(__dirname + '/home/home.html');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('Mongo URI:', process.env.MONGO_URI); // Add this line to check if MONGO_URI is defined

