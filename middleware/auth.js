const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Authentication Middleware
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user associated with the token
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password from the user data

            if (!req.user) {
                return res.status(401).json({ message: 'User not found or token invalid' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ message: 'Token is not valid', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Authorization token missing' });
    }
};

// Authorization Middleware (Optional for Admin Routes)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // Proceed if the user is an admin
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { auth, isAdmin };
