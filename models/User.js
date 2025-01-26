const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Name is required'] 
        },
        email: { 
            type: String, 
            required: [true, 'Email is required'], 
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        password: { 
            type: String, 
            required: [true, 'Password is required'] 
        },
        isAdmin: { 
            type: Boolean, 
            default: false 
        },
        refreshToken: { 
            type: String 
        },
    },
    { 
        timestamps: true 
    }
);

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
