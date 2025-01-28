const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const router = express.Router();


router.post('/profile', auth, getProfile);

module.exports = router;
