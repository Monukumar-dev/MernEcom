const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
        const refreshToken = generateRefreshToken(user.id);
        // Store refreshToken in database or memory (update user's record)
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            accessToken: generateAccessToken(user.id),
            refreshToken,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Login User
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const refreshToken = generateRefreshToken(user.id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            accessToken: generateAccessToken(user.id),
            refreshToken,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// Refresh Token Endpoint
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(user.id);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


// Logout User
const logoutUser = async (req, res) => {
    const { id } = req.body;

    const user = await User.findById(id);
    if (user) {
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } else {
        res.status(400).json({ message: 'Invalid user' });
    }
};

module.exports = { registerUser, authUser, refreshToken, logoutUser };
