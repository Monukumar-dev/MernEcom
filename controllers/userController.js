const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); 
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = await User.create({ name, email, password });

        if (user) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            user.refreshToken = refreshToken;
            await user.save();

            res.status(201).json({
                accessToken,
                refreshToken,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                accessToken,
                refreshToken, 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Refresh Token Endpoint
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const accessToken = generateAccessToken(user.id);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token', error: error.message });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const user = await User.findOne({ refreshToken });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.refreshToken = null; 
        await user.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, authUser, refreshToken, logoutUser };
