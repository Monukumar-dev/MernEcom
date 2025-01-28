const User = require('../models/User');

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password -refreshToken'); // Exclude sensitive fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProfile };
