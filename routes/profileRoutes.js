const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const router = express.Router();


router.get('/profile', auth, getProfile);

module.exports = router;
