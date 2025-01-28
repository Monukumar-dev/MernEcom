const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = express.Router();


// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser); 
router.post('/refresh-token', refreshToken); 

// Protected Routes
router.post('/logout', auth, logoutUser);

module.exports = router;
