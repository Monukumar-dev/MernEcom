const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5m' });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); 
};

// Register User
const registerUser = async (req, res) => {
    const { name, lName, email, password ,mobile, gender, dob } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, lName, email, password, mobile, gender, dob });

        if (user) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            user.refreshToken = refreshToken;
            await user.save();

            // Send refresh token as an httpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({ accessToken });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            user.refreshToken = refreshToken;
            await user.save();

            // Allow credentials to be sent
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            // Set the cookie properly
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",  // Use "strict" or "lax" if frontend and backend are same-origin
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.json({ accessToken });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies; // Get refreshToken from cookies

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
    const { refreshToken } = req.cookies; // Get refreshToken from cookies

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const user = await User.findOne({ refreshToken });

        if (!user) {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
            return res.status(400).json({ message: 'User not found' });
        }

        user.refreshToken = null; // Remove the refresh token from the database
        await user.save();

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { registerUser, loginUser, refreshToken, logoutUser };
